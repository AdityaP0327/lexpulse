let latestAnalysis = null;

module.exports = {
    getLatestAnalysis: () => latestAnalysis,
    setLatestAnalysis: (data) => {
        latestAnalysis = {
            score: data.legal_health_score,
            riskLevel: data.risk_level,
            timestamp: new Date()
        };
    }
};
