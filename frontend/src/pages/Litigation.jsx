import React from 'react';
import { Scale } from 'lucide-react';

const Litigation = () => {
    return (
        <div className="page-container animate-fade-in">
            <div className="page-header">
                <div>
                <h1 className="page-title">Litigation</h1>
                <p className="page-subtitle">Track and manage active legal disputes.</p>
                </div>
            </div>

            <div className="card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
                <Scale size={64} style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No Active Cases</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>You currently have zero active litigation matters. Case details will appear here once added to the system.</p>
                <button className="btn btn-primary" style={{ marginTop: '2rem' }} disabled>Add New Case</button>
            </div>
        </div>
    );
};

export default Litigation;
