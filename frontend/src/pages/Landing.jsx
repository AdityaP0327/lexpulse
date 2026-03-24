import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Moon, Sun, ShieldCheck, FileText, ArrowRight, LayoutDashboard, BrainCircuit } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // If already authenticated, they can just go straight to dashboard
    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Minimalist Header */}
            <nav className="landing-navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="logo-icon">
                        <Scale size={20} />
                    </div>
                    <span className="logo-text">LexPulse</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="desktop-only" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero animate-fade-in">
                <h1 className="landing-title">
                    Compliance <span className="text-gradient">simplified.</span>
                </h1>
                <p className="landing-subtitle">
                    The modern legal and compliance operating system specially designed for MSMEs. Stay ahead of deadlines, parse complex legal documents with AI, and manage litigation risks perfectly.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={handleGetStarted} className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>
                        Get Started <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            {/* Features Grid */}
            <section className="features-grid">
                <div className="card">
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: '#3B82F6' }}>
                        <BrainCircuit size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Smart Legal AI</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Powered by LegalBERT. Extract clauses, compute risk scores, and instantly analyze contracts without legal jargon.
                    </p>
                </div>

                <div className="card">
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: '#10B981' }}>
                        <LayoutDashboard size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Compliance Dashboard</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Track your live MSME health score and quickly monitor upcoming deadlines across taxation, licenses, and filings.
                    </p>
                </div>

                <div className="card">
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: '#F59E0B' }}>
                        <FileText size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Smart Document Vault</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Centralize all your legal assets. Safely store standard contracts, NDAs, and corporate policies with instant retrieval.
                    </p>
                </div>

                <div className="card">
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', color: '#EF4444' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Litigation Tracking</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Log active disputes and arbitration. Secure your case notes and never miss a scheduled hearing.
                    </p>
                </div>
            </section>

            <div style={{ flex: 1 }}></div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-light)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>&copy; {new Date().getFullYear()} LexPulse. Built for modern MSMEs.</p>
            </footer>
        </div>
    );
};

export default Landing;
