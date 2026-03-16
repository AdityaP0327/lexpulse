const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');
const { extractText, cleanText, chunkDocument } = require('../utils/documentParser');
const { detectClauses } = require('../utils/clauseDetector');
const { detectRisks } = require('../utils/riskDetector');
const { calculateScore } = require('../utils/scoringEngine');

// Multer – disk storage for Smart Vault uploads
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/'); },
    filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname)); }
});
const uploadToDisk = multer({ storage: diskStorage });

// Multer – memory storage for AI analysis (no file saved to disk)
const uploadToMemory = multer({ storage: multer.memoryStorage() });

const DEMO_USER_ID = "60d5ecb8b392d7bbc4e85001";

// ─── POST /api/documents/analyze-contract ───────────────────────────────────
// Full AI analysis using Legal-BERT (replaces the Python backend entirely).
router.post('/analyze-contract', uploadToMemory.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // 1. Text Extraction
        console.log(`[analyze-contract] Received file: ${req.file.originalname}, Size: ${req.file.buffer.length} bytes`);
        const rawText = await extractText(req.file.buffer, req.file.originalname);

        // 2. Text Cleaning
        const text = cleanText(rawText);

        if (!text || text.trim().length === 0) {
            console.error('[analyze-contract] Extracted text is empty.');
            return res.status(400).json({ error: 'Could not extract text from document.' });
        }
        console.log(`[analyze-contract] Extracted ${text.length} characters of text.`);

        // 3. Chunking
        const chunks = chunkDocument(text, 300);

        // 4. Legal Clause Detection (Legal-BERT semantic similarity)
        const detectedClauses = await detectClauses(chunks);

        // 5. Risk Detection
        const riskData = detectRisks(detectedClauses, text);

        // 6. Scoring (now uses text for length-based dynamic scoring)
        const scoringResults = calculateScore(riskData, text);

        // 7. Save to memory so Dashboard can display it
        const { setLatestAnalysis } = require('../utils/scoreStore');
        setLatestAnalysis(scoringResults);

        res.json({
            legal_health_score: scoringResults.legal_health_score,
            risk_level: scoringResults.risk_level,
            detected_clauses: detectedClauses,
            missing_clauses: scoringResults.missing_clauses,
            risk_flags: scoringResults.risk_flags,
            recommendations: scoringResults.recommendations
        });

    } catch (err) {
        console.error('[analyze-contract] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/documents/upload ─────────────────────────────────────────────
// Smart Vault upload – saves file to disk, stores metadata in DB
router.post('/upload', uploadToDisk.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const newDoc = new Document({
            userId: DEMO_USER_ID,
            title: req.file.originalname,
            type: req.body.type || 'General',
            filePath: req.file.path,
            isBlockchainVerified: true
        });

        await newDoc.save();
        res.status(201).json({ msg: 'Document uploaded successfully', document: newDoc });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ msg: 'Server Error during upload', error: err.message });
    }
});

// ─── GET /api/documents ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find({ userId: DEMO_USER_ID }).sort({ uploadDate: -1 });
        res.json(documents);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error fetching documents' });
    }
});

module.exports = router;
