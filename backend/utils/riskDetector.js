/**
 * Analyzes detected clauses and full text to highlight legal risks.
 * @param {string[]} detectedClauses
 * @param {string} text - Full document text
 * @returns {{ risk_flags: string[], missing_clauses: string[], clause_presence: Record<string, boolean> }}
 */
function detectRisks(detectedClauses, text) {
    const textLower = text.toLowerCase();
    
    // Convert array to a fast lookup set
    const clauseSet = new Set(detectedClauses);

    // 1. Clause Presence Object
    const allClauses = [
        'termination', 'liability', 'confidentiality', 'payment terms',
        'governing law', 'dispute resolution', 'force majeure',
        'intellectual property', 'indemnification', 'warranty',
        'assignment', 'renewal', 'severability', 'notice clause', 'jurisdiction'
    ];

    const clausePresence = {};
    const missingClauses = [];

    allClauses.forEach(clause => {
        const isPresent = clauseSet.has(clause);
        clausePresence[clause] = isPresent;
        if (!isPresent) {
            missingClauses.push(clause);
        }
    });

    // 2. Risk Detection
    const riskFlags = [];

    const riskPhrases = [
        { phrase: 'unlimited liability', label: 'unlimited liability phrase detected' },
        { phrase: 'not responsible for damages', label: 'ambiguous language' },
        { phrase: 'no termination rights', label: 'one sided termination' },
        { phrase: 'payment timeline undefined', label: 'vague payment terms' },
        { phrase: 'customer cannot terminate', label: 'one sided termination' },
        { phrase: 'no governing law defined', label: 'missing governing law explicitly stated' },
        { phrase: 'no dispute resolution', label: 'missing dispute resolution explicitly stated' },
        { phrase: 'ambiguous responsibilities', label: 'ambiguous language' }
    ];

    for (const risk of riskPhrases) {
        if (textLower.includes(risk.phrase)) {
            riskFlags.push(risk.label);
        }
    }

    return { risk_flags: riskFlags, missing_clauses: missingClauses, clause_presence: clausePresence };
}

module.exports = { detectRisks };
