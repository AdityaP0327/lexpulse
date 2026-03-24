import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Moon, Sun, ArrowRight, ShieldCheck, FileText, 
    BrainCircuit, Calendar, TrendingUp, AlertTriangle, 
    CheckCircle2, XCircle, Search, Building2, Factory,
    Stethoscope, Computer, Briefcase, Pill, Laptop, Bell
} from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Landing = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // Risk Simulator State
    const [employeeCount, setEmployeeCount] = useState(15);
    const [revenue, setRevenue] = useState(500);

    const handleGetStarted = () => navigate(isAuthenticated ? '/dashboard' : '/register');

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* 1. Navigation Bar */}
            <nav className="landing-navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/logo.png" alt="LexPulse" style={{ height: '32px', objectFit: 'contain' }} />
                    <span className="logo-text desktop-only">LexPulse</span>
                </div>
                
                <div className="desktop-only" style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    <a href="#problem">The Problem</a>
                    <a href="#solution">Solution</a>
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="desktop-only" style={{ fontWeight: 500, color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Login</Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Ambient Background Glow for Dark Mode */}
            {theme === 'dark' && (
                <div style={{ position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', zIndex: -1, pointerEvents: 'none' }}></div>
            )}

            {/* 2. Hero Section */}
            <header className="landing-section" style={{ paddingTop: '8rem', textAlign: 'center', position: 'relative' }}>
                <div className="badge badge-info" style={{ marginBottom: '2rem' }}>New: Legal Health Score Beta 🚀</div>
                <h1 className="landing-title">
                    AI-Powered Legal <span className="text-gradient">Health Companion.</span>
                </h1>
                <p className="landing-subtitle">
                    Transforming Law from Reactive Crisis to Proactive Protection. Managing a business shouldn't feel like walking through a legal minefield. LexPulse monitors your legal health 24/7, giving you the clarity and tools to protect what you've built.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button onClick={handleGetStarted} className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem', borderRadius: '40px' }}>
                        Signup
                    </button>
                    <a href="#problem" className="btn btn-secondary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>
                        See the Problem
                    </a>
                </div>

                {/* Hero Mockup Graphic */}
                <div style={{ marginTop: '5rem', position: 'relative' }}>
                    {/* Secondary subtle glow behind the panel */}
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(168, 85, 247, 0.2))', filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none', borderRadius: '50%' }}></div>
                    
                    <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left', position: 'relative', zIndex: 2, background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Legal Health Score</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Your real-time compliance status.</p>
                            </div>
                            <div className="score-ring" style={{ width: '120px', height: '120px', margin: 0 }}>
                                <div className="score-value text-gradient" style={{ fontSize: '3rem' }}>72</div>
                            </div>
                        </div>
                        <div className="alert-item" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                            <div className="alert-icon warning"><AlertTriangle size={20} /></div>
                            <div>
                                <h4 style={{ color: '#F59E0B' }}>Fair - Needs Attention</h4>
                                <p style={{ margin: 0 }}>2 items are expiring soon. Tax filing deadline approaching.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. The Problem (Global Compliance Crisis) */}
            <section id="problem" className="landing-section-alt">
                <div className="landing-section" style={{ padding: 0 }}>
                    <h2 className="section-title">The world has a compliance problem.</h2>
                    <p className="section-subtitle">Regulatory complexity is silently draining small businesses everywhere — wasting time, money, and growth potential on a massive scale.</p>
                    
                    <div className="page-grid split-layout" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div className="stat-block">
                            <div className="stat-number">343M+</div>
                            <p style={{ color: 'var(--text-secondary)' }}>Small businesses worldwide growing every year.</p>
                        </div>
                        <div className="stat-block">
                            <div className="stat-number text-gradient">51%</div>
                            <p style={{ color: 'var(--text-secondary)' }}>Say regulations are their major business challenge.</p>
                        </div>
                        <div className="stat-block">
                            <div className="stat-number">42%</div>
                            <p style={{ color: 'var(--text-secondary)' }}>Working hours lost to compliance without systems.</p>
                        </div>
                        <div className="stat-block">
                            <div className="stat-number text-gradient">$Trillions</div>
                            <p style={{ color: 'var(--text-secondary)' }}>Lost annually to regulatory complexity globally.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Hidden Risks in Plain Sight */}
            <section className="landing-section">
                <h2 className="section-title">Hidden Risks in <span style={{ color: '#EF4444' }}>Plain Sight</span></h2>
                <p className="section-subtitle">Most businesses handle legal work reactively — when something goes wrong. Contracts expire unnoticed, and risks accumulate silently.</p>
                
                <div className="features-grid" style={{ marginTop: '2rem' }}>
                    <div className="card">
                        <div className="badge badge-danger" style={{ marginBottom: '1rem' }}>Insight</div>
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>73%</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>of small businesses have never had a professional legal audit.</p>
                    </div>
                    <div className="card">
                        <div className="badge badge-warning" style={{ marginBottom: '1rem' }}>Financial Impact</div>
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>$150K</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>average cost per legal dispute for standard small businesses.</p>
                    </div>
                    <div className="card">
                        <div className="badge badge-danger" style={{ marginBottom: '1rem' }}>Survival Rate</div>
                        <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>60%</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>of businesses facing major legal challenges never fully recover.</p>
                    </div>
                </div>
            </section>

            {/* 5. The Solution (Legal Command Centre) */}
            <section id="solution" className="landing-section-alt">
                <div className="landing-section" style={{ padding: 0, display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h2 className="section-title">There is a better way.</h2>
                        <p className="section-subtitle">LexPulse transforms legal management from reactive firefighting into proactive protection.</p>
                    </div>

                    <div className="content-grid" style={{ alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Your Legal Command Centre</h3>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.125rem' }}>AI-Powered Monitoring</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>Real-time scanning of assets for compliance gaps.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.125rem' }}>Secure Document Vault</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>Bank-grade encryption for your most sensitive data.</p>
                                    </div>
                                </li>
                                <li style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.125rem' }}>Proactive Alerts</h4>
                                        <p style={{ color: 'var(--text-secondary)' }}>Never miss a filing deadline or contract renewal.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="card glass-panel" style={{ padding: '2rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Live Radar Status</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>Contract Compliance</span>
                                        <span style={{ color: '#10B981' }}>88%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px' }}>
                                        <div style={{ width: '88%', height: '100%', background: '#10B981', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>Regulatory Filings</span>
                                        <span style={{ color: '#F59E0B' }}>72%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px' }}>
                                        <div style={{ width: '72%', height: '100%', background: '#F59E0B', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>Employment Law</span>
                                        <span style={{ color: '#EF4444' }}>61%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '4px' }}>
                                        <div style={{ width: '61%', height: '100%', background: '#EF4444', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Legal Health Score Concept */}
            <section className="landing-section">
                <h2 className="section-title">Your Business Deserves a <span className="text-gradient">Legal Credit Score</span></h2>
                <p className="section-subtitle">Like a financial CIBIL or FICO score, but for legal health. It turns hidden risk into measurable, actionable intelligence.</p>
                <div className="features-grid">
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Search size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Identifies Risk Early</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Catch expiring contracts and evolving liabilities before they become expensive disputes.</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <TrendingUp size={40} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Tracks Progress</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Watch your score rise as you complete recommended compliance tasks tailored for you.</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Building2 size={40} color="#8B5CF6" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Benchmarks Performance</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Compare your legal hygiene against industry standards and top-performing peers.</p>
                    </div>
                </div>
            </section>

            {/* 7 & 8: Core Features & How it Works */}
            <section id="features" className="landing-section-alt">
                <div className="landing-section" style={{ padding: 0 }}>
                    <h2 className="section-title">Complete Control Framework</h2>
                    <div className="features-grid" style={{ marginTop: '3rem' }}>
                        {[
                            { icon: <FileText/>, title: 'Smart Legal Vault', desc: 'Cloud storage with intelligent categorisation and expiry tracking.' },
                            { icon: <BrainCircuit/>, title: 'AI-Powered Analysis', desc: 'NLP engine reads documents for risks, gaps, and compliance issues.' },
                            { icon: <Bell/>, title: 'Preemptive Alerts', desc: 'Automated tracking for renewals and regulatory framework changes.' },
                            { icon: <ShieldCheck/>, title: 'Quarterly Check-ups', desc: 'Structured wellness reviews ensuring deep structural hygiene.' },
                            { icon: <Search/>, title: 'Compliance Radar', desc: 'Real-time monitoring of relevant industry regulations impacting you.' },
                            { icon: <Building2/>, title: 'Privacy & Security', desc: 'Bank-grade encryption protecting your most sensitive trade secrets.' }
                        ].map((f, i) => (
                            <div key={i} className="card" style={{ background: 'var(--bg-main)' }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{f.icon}</div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* 11. Industry Verticals */}
            <section className="landing-section-alt">
                <div className="landing-section" style={{ padding: 0 }}>
                    <h2 className="section-title">Built for Your Industry</h2>
                    <p className="section-subtitle">Specialized compliance checklists tailored flawlessly for the exact operations of your specific sector.</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                        {[
                            { name: 'Manufacturing', icon: <Factory size={20}/> },
                            { name: 'IT/SaaS', icon: <Computer size={20}/> },
                            { name: 'Healthcare', icon: <Stethoscope size={20}/> },
                            { name: 'BFSI', icon: <Building2 size={20}/> },
                            { name: 'Pharma', icon: <Pill size={20}/> },
                            { name: 'Real Estate', icon: <Building2 size={20}/> },
                            { name: 'Retail', icon: <Briefcase size={20}/> },
                            { name: 'Startups', icon: <Laptop size={20}/> }
                        ].map((ind, i) => (
                            <div key={i} className="badge" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: 'var(--bg-main)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', textTransform: 'none', gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: 'var(--primary)' }}>{ind.icon}</span>
                                {ind.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 12. Comparison Table */}
            <section className="landing-section">
                <h2 className="section-title">Why LexPulse Wins</h2>
                <div className="table-container">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature</th>
                                <th style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.25rem' }}>LexPulse</th>
                                <th>Law Firms</th>
                                <th>DIY / Spreadsheets</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Cost Model</td>
                                <td style={{ color: 'var(--primary)', fontWeight: 600 }}>$39/month Flat</td>
                                <td>$300+/hour</td>
                                <td>"Free" (Hidden Risk Costs)</td>
                            </tr>
                            <tr>
                                <td>Monitoring frequency</td>
                                <td><CheckCircle2 color="#10B981" style={{ margin: '0 auto' }}/> 24/7 Always-on</td>
                                <td><XCircle color="#EF4444" style={{ margin: '0 auto' }}/> Only when requested</td>
                                <td><XCircle color="#EF4444" style={{ margin: '0 auto' }}/> Never</td>
                            </tr>
                            <tr>
                                <td>Proprietary Legal Score</td>
                                <td><CheckCircle2 color="#10B981" style={{ margin: '0 auto' }}/> Yes</td>
                                <td><XCircle color="#EF4444" style={{ margin: '0 auto' }}/> No</td>
                                <td><XCircle color="#EF4444" style={{ margin: '0 auto' }}/> No</td>
                            </tr>
                            <tr>
                                <td>AI Contract Parsing</td>
                                <td><CheckCircle2 color="#10B981" style={{ margin: '0 auto' }}/> Instant LegalBERT</td>
                                <td><XCircle color="#EF4444" style={{ margin: '0 auto' }}/> Manual review</td>
                                <td><XCircle color="#EF4444" style={{ margin: '0 auto' }}/> None</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* 14. Pricing Plans */}
            <section id="pricing" className="landing-section-alt">
                <div className="landing-section" style={{ padding: 0 }}>
                    <h2 className="section-title">Transparent, Scalable Pricing</h2>
                    <p className="section-subtitle">No hourly billing surprises. Just world-class legal software.</p>
                    
                    <div className="page-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <div className="pricing-card">
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Core Plan</h3>
                            <div className="pricing-price">$39<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Up to 50 Documents</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Core LegalBERT AI Analysis</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> 3 Automated Alerts/mo</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Base Legal Health Score</li>
                            </ul>
                            <button onClick={handleGetStarted} className="btn btn-secondary" style={{ width: '100%' }}>Start Free Trial</button>
                        </div>

                        <div className="pricing-card popular">
                            <div className="badge badge-info" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Most Popular</div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Growth</h3>
                            <div className="pricing-price">$99<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Unlimited Document Vault</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Unlimited AI Scanning</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Premium Industry Checklists</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Quarterly Solicitor Checkups</li>
                            </ul>
                            <button onClick={handleGetStarted} className="btn btn-primary" style={{ width: '100%' }}>Choose Growth</button>
                        </div>

                        <div className="pricing-card">
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Enterprise</h3>
                            <div className="pricing-price">Custom</div>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Multi-Entity Support</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Custom API Access</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> SSO Integration</li>
                                <li><CheckCircle2 size={18} color="var(--primary)" /> Dedicated Account Manager</li>
                            </ul>
                            <button className="btn btn-secondary" style={{ width: '100%' }}>Contact Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 15. Footer & Final CTA */}
            <footer style={{ padding: '6rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Be Among the First to Get Legal Control.</h2>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                    <button onClick={handleGetStarted} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem', borderRadius: '40px' }}>
                        Signup Now
                    </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            <img src="/logo.png" alt="LexPulse" style={{ height: '32px', filter: theme === 'dark' ? 'brightness(1)' : 'brightness(0)' }} /> 
                            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>LexPulse</span>
                        </div>
                        <p style={{ fontSize: '0.875rem' }}>Transforming law from reactive crisis to proactive daily protection globally.</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Product</h4>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Features</p>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Pricing</p>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Signup</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Company</h4>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>About</p>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Research</p>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Contact</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Legal</h4>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Privacy Policy</p>
                        <p style={{ marginBottom: '0.5rem', cursor: 'pointer' }}>Terms of Service</p>
                        <p style={{ fontSize: '0.75rem', marginTop: '2rem' }}>Disclaimer: LexPulse is a software tool, not a law firm.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
