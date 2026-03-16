/**
 * Calculates the Legal Health Score based on detected risks and missing clauses.
 * @param {{ risk_flags: string[], missing_clauses: string[], clause_presence: Record<string, boolean> }} riskData
 * @param {string} text - Full document text
 * @returns {{ legal_health_score: number, risk_level: string, recommendations: string[], risk_flags: string[], missing_clauses: string[] }}
 */
function calculateScore(riskData, text) {
    let score = 100;
    const recommendations = [];

    const { clause_presence, missing_clauses, risk_flags } = riskData;

    // --- 1. Deductions for Missing Clauses ---
    
    // Critical Clauses
    if (!clause_presence['liability']) { score -= 20; recommendations.push('Critical: Add a Limitation of Liability clause.'); }
    if (!clause_presence['termination']) { score -= 15; recommendations.push('Critical: Add clear Termination rights.'); }

    // Important Clauses
    if (!clause_presence['confidentiality']) { score -= 10; recommendations.push('Important: Add a Confidentiality/NDA clause.'); }
    if (!clause_presence['payment terms']) { score -= 10; recommendations.push('Important: Define Payment Terms explicitly.'); }
    if (!clause_presence['governing law']) { score -= 8; recommendations.push('Important: Specify Governing Law.'); }
    if (!clause_presence['dispute resolution']) { score -= 8; recommendations.push('Important: Add Dispute Resolution mechanisms.'); }

    // Medium Clauses
    if (!clause_presence['force majeure']) { score -= 5; recommendations.push('Consider adding a Force Majeure clause.'); }
    if (!clause_presence['intellectual property']) { score -= 5; recommendations.push('Consider adding an Intellectual Property clause.'); }

    // --- 2. Deductions for Risk Flags ---
    
    risk_flags.forEach(flag => {
        if (flag === 'unlimited liability phrase detected') {
            score -= 25;
            recommendations.push('High Risk: Remove or cap unlimited liability phrasing.');
        } else if (flag === 'one sided termination') {
            score -= 15;
            recommendations.push('High Risk: Ensure termination rights are mutual.');
        } else if (flag === 'vague payment terms') {
            score -= 10;
            recommendations.push('Clarify payment criteria and timelines.');
        } else if (flag === 'ambiguous language') {
            score -= 5;
            recommendations.push('Clarify ambiguous responsibilities or damages clauses.');
        }
    });

    // --- 3. Dynamic Factors (Length & Coverage) ---
    // If it's a very short document but has many clauses missing, it's expected.
    // If it's a very long document lacking standard clauses, it's riskier.
    const wordCount = text.split(/\s+/).length;
    
    // Total possible clauses = 15
    const totalClauses = 15;
    const detectedCount = totalClauses - missing_clauses.length;
    const coveragePercentage = detectedCount / totalClauses;

    // Small bonus for highly comprehensive documents
    if (coveragePercentage > 0.8 && wordCount > 500) {
        score += 5;
    }

    // Ensure score bounded to [0, 100]
    score = Math.max(0, Math.min(100, score));

    // --- 4. Risk Classification ---
    let riskLevel;
    if (score >= 85) {
        riskLevel = 'Low Risk';
    } else if (score >= 70) {
        riskLevel = 'Moderate Risk';
    } else if (score >= 50) {
        riskLevel = 'High Risk';
    } else {
        riskLevel = 'Critical Risk';
    }

    return {
        legal_health_score: score,
        risk_level: riskLevel,
        recommendations,
        risk_flags,
        missing_clauses
    };
}

module.exports = { calculateScore };
