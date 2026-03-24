import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Info, FileText, CheckCircle, UploadCloud, FolderPlus, CheckSquare, Clock } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const Dashboard = () => {
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState({
    aggregateScore: null,
    totalDocuments: 0,
    alerts: []
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // AI Analysis State
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchHealthScore = async () => {
    try {
      const res = await axios.get(`${API_URL}/health-score`);
      setHealthData({
        aggregateScore: res.data.aggregateScore,
        totalDocuments: res.data.totalDocuments || 0,
        alerts: res.data.alerts || []
      });
    } catch (err) {
      console.error("Error fetching health score:", err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      const pending = res.data.filter(t => t.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3);
      setUpcomingTasks(pending);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchHealthScore();
    fetchUpcomingTasks();
  }, []);

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    
    setAiLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/documents/analyze-contract`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      // Refresh the Dashboard health score immediately after a successful scan
      fetchHealthScore();
    } catch (error) {
      console.error("Error analyzing document", error);
      // Safely extract the precise backend error message instead of a generic fallback
      const backendErrorMessage = error.response?.data?.error || "Analysis failed. Please check if the file is a valid PDF/Word/Text document.";
      setResult({ error: backendErrorMessage });
    } finally {
      setAiLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const score = healthData.aggregateScore;

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Company Legal Health</h1>
          <p className="page-subtitle">Your organization's current legal risk assessment from recent AI scans.</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        {/* Premium Health Score Card */}
        <div className="card score-card" style={{ background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(10, 12, 20, 0.4) 100%)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', width: '100%', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <ShieldAlert size={20} className="text-gradient" />
              Legal Health Score
            </h3>
            <div title="Detailed risk metric derived from Semantic AI analysis of clause coverage and liability exposure." style={{ cursor: 'help', color: 'var(--text-muted)' }}>
              <Info size={18} />
            </div>
          </div>
          
          <div className="score-ring" style={{ width: '100%', maxWidth: '200px', aspectRatio: '1/1', marginBottom: '1rem', position: 'relative' }}>
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '70%', height: '70%', borderRadius: '50%', background: score > 80 ? 'rgba(16, 185, 129, 0.2)' : score > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)', filter: 'blur(30px)', zIndex: 0 }}></div>
            
            <svg viewBox="0 0 200 200" style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)', zIndex: 1, dropShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>
              <defs>
                <linearGradient id="scoreGradientGood" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="scoreGradientWarn" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
                <linearGradient id="scoreGradientDanger" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF3B30" />
                  <stop offset="100%" stopColor="#F87171" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.03)" strokeWidth="14" fill="none" />
              <circle 
                cx="100" cy="100" r="90" 
                stroke={score > 80 ? "url(#scoreGradientGood)" : score > 50 ? "url(#scoreGradientWarn)" : "url(#scoreGradientDanger)"} 
                strokeWidth="14" 
                fill="none" 
                strokeDasharray="565" 
                strokeDashoffset={score === null || dashboardLoading ? 565 : 565 - (565 * score) / 100} 
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)', filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}
              />
            </svg>
            <div className="score-value" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{dashboardLoading ? '--' : (score === null ? 'N/A' : score)}</div>
          </div>
          
          <div style={{ textAlign: 'center', zIndex: 2 }}>
            {score !== null ? (
              <>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: score > 80 ? '#34D399' : score > 50 ? '#FBBF24' : '#F87171', marginBottom: '0.25rem' }}>
                  {score > 80 ? 'Excellent Standing' : score > 50 ? 'Moderate Risk Exposure' : 'Critical Legal Vulnerability'}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', padding: '0 1rem' }}>
                  {score > 80 ? 'Recent scans show strong clause coverage and minimal liability flags.' : 'Recent scans indicate missing clauses or high-liability phrasing requiring review.'}
                </p>
              </>
            ) : (
               <>
                 <span className="badge badge-info" style={{ marginBottom: '0.5rem', fontSize: '0.875rem', padding: '0.35rem 0.85rem' }}>Awaiting Data</span>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', padding: '0 1rem' }}>Upload a contract below to establish your organizational health baseline.</p>
               </>
            )}
          </div>
        </div>

        {/* Premium Alerts Card */}
        <div className="card alerts-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <AlertTriangle size={20} className="text-gradient" />
            Active Legal Alerts
          </h3>
          
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {dashboardLoading ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                 <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid var(--border-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                 Syncing Vault Data...
               </div>
            ) : healthData.alerts.length === 0 ? (
              <div className="alert-item" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div className="alert-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}><CheckCircle size={20} /></div>
                <div className="alert-content">
                  <h4 style={{ color: '#E2E8F0' }}>Zero Active Threats</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>All organizational documents are in good standing.</p>
                </div>
              </div>
            ) : (
              healthData.alerts.map((alert, idx) => (
                <div key={idx} className="alert-item" style={{ 
                  background: alert.type === 'danger' ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)' : alert.type === 'warning' ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)' : 'var(--bg-main)',
                  borderLeft: `4px solid ${alert.type === 'danger' ? '#EF4444' : alert.type === 'warning' ? '#F59E0B' : '#3B82F6'}`,
                  borderColor: 'var(--border-light)',
                  borderLeftColor: alert.type === 'danger' ? '#EF4444' : alert.type === 'warning' ? '#F59E0B' : '#3B82F6',
                  padding: '1.25rem'
                }}>
                  <div className={`alert-icon ${alert.type}`} style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                    {alert.type === 'danger' ? <ShieldAlert size={20} /> : <Info size={20} />}
                  </div>
                  <div className="alert-content" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', color: '#F8FAFC' }}>{alert.title}</h4>
                      {alert.date && <span className="alert-time" style={{ background: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{new Date(alert.date).toLocaleDateString()}</span>}
                    </div>
                    <p style={{ lineHeight: '1.6', marginBottom: '1rem', color: '#CBD5E1' }}>{alert.desc}</p>
                    <button className="btn btn-secondary" style={{ 
                      padding: '0.4rem 1rem', 
                      fontSize: '0.8rem',
                      background: alert.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
                      color: alert.type === 'danger' ? '#FCA5A5' : 'var(--text-primary)',
                      border: alert.type === 'danger' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-light)'
                    }}>
                      {alert.type === 'danger' ? 'Review Critical Risk' : 'Read Detail'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks Preview */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem', gridTemplateColumns: '1fr' }}>
        <div className="card" style={{ background: 'var(--bg-surface)' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <CheckSquare size={20} className="text-gradient" />
            Upcoming Tasks
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
              <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>{task.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                </div>
                <div style={{ color: '#FBBF24', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> Pending</div>
              </div>
            )) : (
              <div style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>No upcoming tasks.</div>
            )}
          </div>
          <Link to="/tasks" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>View All Tasks</Link>
        </div>
      </div>

      {/* Premium Embedded AI Analysis Section */}
      <h2 style={{ marginBottom: '1.5rem', marginTop: '3rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <FileText className="text-gradient" size={24}/>
        On-Demand Contract Scans
      </h2>
      <div className={`page-grid ${result ? 'split-layout' : ''}`}>
        
        {/* Upload Section */}
        <div style={{ alignSelf: 'start', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
          <div>
            <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".pdf,.docx,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
              }
              e.target.value = null; // Clear so the same file can be re-selected
            }}
          />
          <div 
            className={`upload-area ${aiLoading ? 'drag-active' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ 
              opacity: aiLoading ? 0.7 : 1, 
              pointerEvents: aiLoading ? 'none' : 'auto', 
              cursor: 'pointer', 
              background: 'linear-gradient(145deg, rgba(18, 22, 36, 0.6) 0%, rgba(10, 12, 20, 0.8) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem', 
              border: aiLoading ? '2px dashed var(--primary)' : '2px dashed rgba(255,255,255,0.1)', 
              padding: '4rem 2rem', 
              textAlign: 'center',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {aiLoading ? (
               <div className="spinner" style={{ width: '48px', height: '48px', border: '4px solid rgba(0, 194, 255, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }}></div>
            ) : (
               <UploadCloud size={56} className="upload-icon mx-auto" style={{ display: 'block', margin: '0 auto 1.5rem', color: 'var(--primary)', filter: 'drop-shadow(0 0 8px rgba(0,194,255,0.5))' }} />
            )}
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: aiLoading ? 'var(--primary)' : 'white' }}>
              {aiLoading ? 'Analyzing with Legal-BERT...' : 'Upload Contract'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Drag & drop or <span className="text-gradient" style={{ fontWeight: 'bold' }}>browse files</span> to scan</p>
            {file && !aiLoading && (
              <div style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,194,255,0.1)', border: '1px solid rgba(0,194,255,0.2)', padding: '0.5rem 1rem', borderRadius: '2rem', color: 'var(--primary)', fontSize: '0.875rem' }}>
                <FileText size={16} /> {file.name}
              </div>
            )}
          </div>
          </div>
          
          {/* Bulk Upload Placeholder */}
          <div 
            className="upload-area"
            style={{ 
              cursor: 'not-allowed', 
              background: 'linear-gradient(145deg, rgba(18, 22, 36, 0.4) 0%, rgba(10, 12, 20, 0.5) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem', 
              border: '2px dashed rgba(255,255,255,0.05)', 
              padding: '4rem 2rem', 
              textAlign: 'center',
              opacity: 0.7
            }}
          >
            <FolderPlus size={56} className="mx-auto" style={{ display: 'block', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              Bulk Upload
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Upload multiple files at once<br/><span style={{ fontSize: '0.8rem', opacity: 0.7 }}>(Coming soon)</span></p>
          </div>
        </div>

        {/* Results Column */}
        {result && !result.error && (
          <div className="card" style={{ 
            animation: 'fadeIn 0.6s ease-out',
            border: `1px solid ${result.risk_level === 'High Risk' || result.risk_level === 'Critical Risk' ? 'rgba(239,68,68,0.3)' : result.risk_level === 'Moderate Risk' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
            boxShadow: `0 10px 40px ${result.risk_level === 'High Risk' || result.risk_level === 'Critical Risk' ? 'rgba(239,68,68,0.1)' : result.risk_level === 'Moderate Risk' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)'}`,
            background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(10, 12, 20, 0.95) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Scan Complete</h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{file?.name}</span>
              </div>
              <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Document Score</span>
                <div style={{ fontSize: '2.5rem', lineHeight: '1', fontWeight: 'bold', color: result.risk_level === 'High Risk' || result.risk_level === 'Critical Risk' ? '#F87171' : result.risk_level === 'Moderate Risk' ? '#FBBF24' : '#34D399', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {result.legal_health_score}<span style={{fontSize: '1.25rem', color: 'var(--text-muted)'}}>/100</span>
                </div>
              </div>
            </div>

            <div className="content-grid">
              <div style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '1rem', padding: '1.25rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34D399', fontSize: '1.1rem', marginBottom: '1rem' }}><CheckCircle size={18} /> Found Clauses</h4>
                <ul style={{ listStyle: 'none', paddingLeft: '0', margin: 0 }}>
                  {result.detected_clauses.length > 0 ? result.detected_clauses.map((clause, i) => (
                    <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#E2E8F0', fontSize: '0.95rem' }}>
                      <span style={{ color: '#34D399', fontSize: '1.2rem' }}>•</span>
                      {clause}
                    </li>
                  )) : <li style={{ color: 'var(--text-muted)' }}>None detected.</li>}
                </ul>
              </div>
              
              <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '1rem', padding: '1.25rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F87171', fontSize: '1.1rem', marginBottom: '1rem' }}><AlertTriangle size={18} /> Missing Clauses</h4>
                <ul style={{ listStyle: 'none', paddingLeft: '0', margin: 0 }}>
                  {result.missing_clauses.length > 0 ? result.missing_clauses.map((clause, i) => (
                    <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#E2E8F0', fontSize: '0.95rem' }}>
                      <span style={{ color: '#F87171', fontSize: '1.2rem' }}>•</span>
                      {clause}
                    </li>
                  )) : <li style={{ color: 'var(--text-muted)' }}>All checked clauses are present.</li>}
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FBBF24', fontSize: '1.1rem', marginBottom: '1rem' }}><ShieldAlert size={18} /> Detected Risk Phrases</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.risk_flags.length > 0 ? result.risk_flags.map((flag, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'linear-gradient(90deg, rgba(245,158,11,0.1) 0%, transparent 100%)', borderLeft: '3px solid #F59E0B', borderRadius: '4px', color: '#F8FAFC' }}>
                    {flag}
                  </div>
                )) : (
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>
                    No explicit high-risk phrases detected in text.
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', borderRadius: '1rem', padding: '1.5rem' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
                <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Recommendations</span> 💡
              </h4>
              <ul style={{ paddingLeft: '0', color: '#CBD5E1', listStyle: 'none', margin: 0 }}>
                {result.recommendations.length > 0 ? result.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--primary)', marginTop: '0.2rem' }}>→</span>
                    <span>{rec}</span>
                  </li>
                )) : <li style={{ color: 'var(--text-muted)' }}>Document looks healthy. No recommendations.</li>}
              </ul>
            </div>
          </div>
        )}
        
        {result && result.error && (
          <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'linear-gradient(90deg, rgba(239,68,68,0.05) 0%, transparent 100%)' }}>
            <h3 style={{ color: '#F87171', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
               <AlertTriangle size={20} /> Analysis Error
            </h3>
            <p style={{ color: '#E2E8F0' }}>{result.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
