const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

const DEMO_USER_ID = "60d5ecb8b392d7bbc4e85001";

// GET /api/health-score
// Calculates aggregate score from all user's uploaded documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find({ userId: DEMO_USER_ID });
        
        const { getLatestAnalysis } = require('../utils/scoreStore');
        const latest = getLatestAnalysis();
        
        if (documents.length === 0 && !latest) {
            return res.json({ 
                aggregateScore: null, 
                alerts: [{ title: 'No Documents', desc: 'Scan a contract or upload to your Smart Vault to generate a Legal Health Score.', type: 'info' }] 
            });
        }

        let totalScore = 0;
        let allAlerts = [];

        // Mock Regulatory Change Alert for the demo
        allAlerts.push({
            title: "Regulatory Change Update",
            desc: "New compliance regulations regarding data privacy (GDPR amendments) take effect next month. Ensure all policies are up to date.",
            type: "warning",
            date: new Date()
        });

        documents.forEach(doc => {
// Document Expiration Alerts
            if (doc.expiryDate) {
                const today = new Date();
                const timeDiff = new Date(doc.expiryDate).getTime() - today.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                if (daysDiff < 0) {
                    allAlerts.push({
                        title: `Expired Document: ${doc.title}`,
                        desc: `This document expired ${Math.abs(daysDiff)} days ago. Immediate action required to maintain compliance.`,
                        type: 'danger',
                        date: new Date() // recent alert
                    });
                } else if (daysDiff <= 30) {
                    allAlerts.push({
                        title: `Expiring Soon: ${doc.title}`,
                        desc: `This document will expire in ${daysDiff} days. Review for renewal or renegotiation.`,
                        type: 'warning',
                        date: new Date() // recent alert
                    });
                }
            }
        });

        // Sort alerts by date (newest first)
        const sortedAlerts = allAlerts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Removed duplicate latest analysis fetch

        res.json({
            aggregateScore: latest ? latest.score : null,
            totalDocuments: documents.length,
            alerts: sortedAlerts.slice(0, 5) // Return top 5 alerts
        });

    } catch (err) {
        res.status(500).json({ msg: 'Server Error generating health score' });
    }
});

module.exports = router;
