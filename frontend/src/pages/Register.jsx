import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        businessName: '', 
        email: '', 
        password: '', 
        industry: 'service', 
        msmeType: 'micro' 
    });
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.msg);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
            <div className="card glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--brand-gradient)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)' }}>
                      <Scale size={24} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join LexPulse for your business</p>
                </div>
                
                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
                
                <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Business Name</label>
                        <input className="input-field" type="text" placeholder="Acme Corp" value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} required />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Industry</label>
                            <select className="input-field" value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })}>
                                <option value="service">Service</option>
                                <option value="manufacturing">Manufacturing</option>
                                <option value="trading">Trading</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Entity Type</label>
                            <select className="input-field" value={formData.msmeType} onChange={e => setFormData({ ...formData, msmeType: e.target.value })}>
                                <option value="micro">Micro</option>
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email Address</label>
                        <input className="input-field" type="email" placeholder="you@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input className="input-field" type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength="6" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>Create Account</button>
                </form>
                
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" className="text-gradient" style={{ fontWeight: 600 }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
