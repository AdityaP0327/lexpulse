/**
 * Legal clause detector using sentence-transformers via @xenova/transformers (ONNX).
 * Uses all-MiniLM-L6-v2 (a sentence-transformers model) for semantic clause similarity,
 * applying the same cosine-similarity approach and threshold as the original Python implementation.
 */

const { pipeline, cos_sim, env } = require('@xenova/transformers');

// Allow @xenova/transformers to fetch models from HuggingFace Hub
env.allowRemoteModels = true;

// The 14 standard legal clauses with their canonical descriptions
// (identical to the Python implementation)
const LEGAL_CLAUSES = {
    'termination': 'Either party may terminate this Agreement upon written notice if the other party breaches any material term.',
    'liability': "In no event shall either party's aggregate liability exceed the total amounts paid under this Agreement.",
    'confidentiality': 'The Receiving Party shall keep confidential all information disclosed by the Disclosing Party.',
    'payment terms': 'The Client agrees to pay the Service Provider within thirty (30) days of receiving an invoice.',
    'governing law': 'This Agreement shall be governed by and construed in accordance with the laws of the State.',
    'dispute resolution': 'Any dispute arising out of this Agreement shall be resolved through binding arbitration.',
    'force majeure': 'Neither party shall be liable for any failure to perform its obligations where such failure results from any cause beyond reasonable control.',
    'intellectual property': 'All intellectual property rights developed during the term of this Agreement shall belong exclusively to the Client.',
    'indemnification': 'The Service Provider shall indemnify and hold harmless the Client from any claims, damages, or expenses.',
    'warranty': 'The Provider warrants that the services will be performed in a professional and workmanlike manner.',
    'assignment': 'Neither party may assign this Agreement without the prior written consent of the other party.',
    'renewal': 'This Agreement shall automatically renew for successive terms unless either party provides written notice of non-renewal.',
    'severability': 'If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force.',
    'notice clause': 'Any notice required under this Agreement shall be in writing and deemed given when delivered personally or sent by certified mail.',
    'jurisdiction': 'The parties consent to the exclusive jurisdiction of the state and federal courts located in the specified jurisdiction.'
};

const CLAUSE_NAMES = Object.keys(LEGAL_CLAUSES);
const CLAUSE_TEXTS = Object.values(LEGAL_CLAUSES);
const THRESHOLD = 0.65;

// Singleton: store the extractor pipeline and pre-computed clause embeddings
let _extractor = null;
let _clauseEmbeddings = null;

/**
 * Lazily loads Legal-BERT and pre-computes clause embeddings on first call.
 * Model is cached by @xenova/transformers in ~/.cache/huggingface.
 */
async function getModelAndEmbeddings() {
    if (!_extractor) {
        console.log('[AI Clause Detector] Loading Xenova/all-MiniLM-L6-v2 via Transformers.js...');
        _extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            quantized: true
        });
        console.log('[Legal-BERT] Model loaded. Pre-computing clause embeddings...');
        _clauseEmbeddings = await _embedBatch(CLAUSE_TEXTS);
        console.log('[Legal-BERT] Ready.');
    }
    return { extractor: _extractor, clauseEmbeddings: _clauseEmbeddings };
}

/**
 * Embeds an array of texts using mean pooling (same as sentence-transformers default).
 */
async function _embedBatch(texts) {
    const embeddings = [];
    for (const text of texts) {
        const output = await _extractor(text, { pooling: 'mean', normalize: true, truncation: true });
        embeddings.push(Array.from(output.data));
        
        // CRITICAL: Manually dispose of the ONNX WASM tensor to prevent memory leaks!
        if (typeof output.dispose === 'function') {
            output.dispose();
        }
    }
    return embeddings;
}

async function detectClauses(chunks) {
    const { extractor, clauseEmbeddings } = await getModelAndEmbeddings();
    const detected = new Set();
    const fullTextLower = chunks.join(' ').toLowerCase();

    // 1. Direct Keyword Matching (Fast & accurate for explicit clauses)
    const exactMatches = {
        'termination': ['terminate', 'termination'],
        'liability': ['liability', 'liable', 'damages'],
        'confidentiality': ['confidential', 'nda', 'non-disclosure'],
        'payment terms': ['payment', 'pay ', 'invoice'],
        'governing law': ['governing law', 'laws of'],
        'dispute resolution': ['dispute', 'arbitration', 'mediation'],
        'force majeure': ['force majeure', 'act of god', 'beyond reasonable control'],
        'intellectual property': ['intellectual property', 'copyright', 'trademark'],
        'indemnification': ['indemnify', 'indemnification', 'hold harmless'],
        'warranty': ['warrant', 'warranty', 'warranties'],
        'assignment': ['assign', 'assignment'],
        'renewal': ['renew', 'renewal'],
        'severability': ['severability', 'severable', 'invalid or unenforceable'],
        'notice clause': ['notice', 'notices'],
        'jurisdiction': ['jurisdiction', 'courts of']
    };

    for (const [clause, keywords] of Object.entries(exactMatches)) {
        if (keywords.some(kw => fullTextLower.includes(kw))) {
            detected.add(clause);
        }
    }

    // 2. Semantic Matching (Fallback for complex phrasing)
    for (const chunk of chunks) {
        if (chunk.split(' ').length < 5) continue;

        const output = await extractor(chunk, { pooling: 'mean', normalize: true, truncation: true });
        const chunkEmbedding = Array.from(output.data);
        
        // CRITICAL: Aggressive memory dumping of the WebAssembly output tensor
        if (typeof output.dispose === 'function') {
            output.dispose();
        }

        for (let i = 0; i < CLAUSE_NAMES.length; i++) {
            const similarity = cos_sim(chunkEmbedding, clauseEmbeddings[i]);
            // Lowered threshold slightly since we use a smaller embedding model
            if (similarity >= 0.55) {
                detected.add(CLAUSE_NAMES[i]);
            }
        }
    }

    return Array.from(detected);
}

module.exports = { detectClauses };
