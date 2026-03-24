import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Info, FileText, CheckCircle, UploadCloud, FolderPlus, CheckSquare, Clock, ArrowRight, TrendingUp, FileSearch } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

/* ─── Reusable sub-components ─── */
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
    <div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)', marginBottom: subtitle ? '0.25rem' : 0 }}>
        <Icon size={20} style={{ color: 'var(--primary)' }} />
        {title}
      </h2>
      {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '2rem' }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Card = ({ children, style, ...props }) => (
  <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', ...style }} {...props}>
    {children}
  </div>
);

const Divider = () => (
  <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2.5rem 0' }} />
);

/* ─── Main Dashboard ─── */
const Dashboard = () => {
  const [healthData, setHealthData] = useState({ aggregateScore: null, totalDocuments: 0, alerts: [] });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchHealthScore = async () => {
    try {
      const res = await axios.get(`${API_URL}/health-score`);
      setHealthData({ aggregateScore: res.data.aggregateScore, totalDocuments: res.data.totalDocuments || 0, alerts: res.data.alerts || [] });
    } catch (err) { console.error('Error fetching health score:', err); }
    finally { setDashboardLoading(false); }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`);
      setUpcomingTasks(res.data.filter(t => t.status === 'pending').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 5));
    } catch (err) { console.error('Error fetching tasks', err); }
  };

  useEffect(() => { fetchHealthScore(); fetchUpcomingTasks(); }, []);

  const handleFileUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setAiLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('document', selectedFile);
    try {
      const response = await axios.post(`${API_URL}/documents/analyze-contract`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(response.data);
      fetchHealthScore();
    } catch (error) {
      setResult({ error: error.response?.data?.error || 'Analysis failed. Please check if the file is a valid PDF/Word/Text document.' });
    } finally { setAiLoading(false); }
  };

  const onDrop = (e) => { e.preventDefault(); if (e.dataTransfer.files?.length > 0) handleFileUpload(e.dataTransfer.files[0]); };
  const score = healthData.aggregateScore;
  const scoreColor = score > 80 ? '#10B981' : score > 50 ? '#F59E0B' : '#EF4444';
  const scoreGradient = score > 80 ? 'url(#scoreGood)' : score > 50 ? 'url(#scoreWarn)' : 'url(#scoreDanger)';

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          PAGE HEADER
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome back. Here's your organization's legal health at a glance.</p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 1 — Quick Stats Row
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Health Score</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: score !== null ? scoreColor : 'var(--text-muted)', lineHeight: 1 }}>
            {dashboardLoading ? '—' : score !== null ? score : 'N/A'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{score !== null ? (score > 80 ? 'Excellent' : score > 50 ? 'Moderate Risk' : 'Critical') : 'No data'}</div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Documents Scanned</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{dashboardLoading ? '—' : healthData.totalDocuments}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Total analyzed</div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Alerts</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: healthData.alerts.length > 0 ? '#EF4444' : '#10B981', lineHeight: 1 }}>{dashboardLoading ? '—' : healthData.alerts.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{healthData.alerts.length === 0 ? 'All clear' : 'Needs attention'}</div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending Tasks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: upcomingTasks.length > 0 ? '#F59E0B' : '#10B981', lineHeight: 1 }}>{upcomingTasks.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{upcomingTasks.length === 0 ? 'All done' : 'Due soon'}</div>
        </Card>
      </div>

      <Divider />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 2 — Health Score Ring + Alerts
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionHeader icon={TrendingUp} title="Legal Health Details" subtitle="Deep-dive into your risk profile and active alerts" />

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {/* Score Ring */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ width: '180px', height: '180px', position: 'relative', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 200 200" style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <defs>
                <linearGradient id="scoreGood" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#34D399" /></linearGradient>
                <linearGradient id="scoreWarn" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#FBBF24" /></linearGradient>
                <linearGradient id="scoreDanger" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#EF4444" /><stop offset="100%" stopColor="#F87171" /></linearGradient>
              </defs>
              <circle cx="100" cy="100" r="85" stroke="var(--border-light)" strokeWidth="12" fill="none" />
              <circle cx="100" cy="100" r="85" stroke={scoreGradient} strokeWidth="12" fill="none"
                strokeDasharray="534" strokeDashoffset={score === null || dashboardLoading ? 534 : 534 - (534 * score) / 100}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.75rem', fontWeight: 700, lineHeight: 1, color: score !== null ? scoreColor : 'var(--text-muted)' }}>
                {dashboardLoading ? '—' : score ?? 'N/A'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>out of 100</span>
            </div>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: score !== null ? scoreColor : 'var(--text-muted)', textAlign: 'center' }}>
            {score !== null ? (score > 80 ? 'Excellent Standing' : score > 50 ? 'Moderate Risk' : 'Critical Vulnerability') : 'Awaiting Data'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem', lineHeight: 1.5 }}>
            {score !== null ? 'Based on AI analysis of uploaded contracts.' : 'Upload a contract below to get started.'}
          </p>
        </Card>

        {/* Alerts */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: '#F59E0B' }} /> Active Alerts
          </h3>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {dashboardLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ width: '24px', height: '24px', border: '3px solid var(--border-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
                Loading alerts…
              </div>
            ) : healthData.alerts.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', background: 'rgba(16,185,129,0.06)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>All Clear</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No active threats detected.</div>
                </div>
              </div>
            ) : healthData.alerts.map((alert, idx) => (
              <div key={idx} style={{
                display: 'flex', gap: '0.75rem', padding: '1rem', borderRadius: '12px',
                background: alert.type === 'danger' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                border: `1px solid ${alert.type === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: alert.type === 'danger' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                  color: alert.type === 'danger' ? '#EF4444' : '#F59E0B'
                }}>
                  {alert.type === 'danger' ? <ShieldAlert size={16} /> : <Info size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{alert.title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Divider />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 3 — Upcoming Tasks
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionHeader
        icon={CheckSquare}
        title="Upcoming Tasks"
        subtitle="Your nearest compliance deadlines"
        action={<Link to="/tasks" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>View All <ArrowRight size={14} /></Link>}
      />

      <Card style={{ marginBottom: '2.5rem' }}>
        {upcomingTasks.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {upcomingTasks.map((task, i) => (
              <div key={task._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0',
                borderBottom: i < upcomingTasks.length - 1 ? '1px solid var(--border-light)' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{task.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>Pending</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <CheckCircle size={24} style={{ color: '#10B981', margin: '0 auto 0.5rem', display: 'block' }} />
            No upcoming tasks. You're all caught up!
          </div>
        )}
      </Card>

      <Divider />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SECTION 4 — AI Contract Scanner
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionHeader icon={FileSearch} title="AI Contract Scanner" subtitle="Upload a document for instant clause analysis powered by Legal-BERT" />

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Upload Zone */}
        <div>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.docx,.txt"
            onChange={(e) => { if (e.target.files?.length > 0) handleFileUpload(e.target.files[0]); e.target.value = null; }} />
          <Card
            onClick={() => !aiLoading && fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            style={{
              cursor: aiLoading ? 'wait' : 'pointer', textAlign: 'center', padding: '3rem 2rem',
              border: aiLoading ? '2px dashed var(--primary)' : '2px dashed var(--border-light)',
              opacity: aiLoading ? 0.8 : 1, transition: 'all 0.2s ease',
              background: 'var(--bg-surface)',
            }}
          >
            {aiLoading ? (
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.25rem' }} />
            ) : (
              <UploadCloud size={40} style={{ color: 'var(--primary)', margin: '0 auto 1.25rem', display: 'block' }} />
            )}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              {aiLoading ? 'Analyzing…' : 'Upload Contract'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Drag & drop or <span style={{ color: 'var(--primary)', fontWeight: 600 }}>browse</span>
            </p>
            {file && !aiLoading && (
              <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(37,99,235,0.08)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--primary)' }}>
                <FileText size={14} /> {file.name}
              </div>
            )}
          </Card>
        </div>

        {/* Bulk Upload */}
        <Card style={{ textAlign: 'center', padding: '3rem 2rem', opacity: 0.5, cursor: 'not-allowed', border: '2px dashed var(--border-light)' }}>
          <FolderPlus size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1.25rem', display: 'block' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Bulk Upload</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Multiple files at once<br /><span style={{ fontSize: '0.75rem' }}>Coming soon</span></p>
        </Card>
      </div>

      {/* ─── Scan Results ─── */}
      {result && !result.error && (
        <Card style={{
          animation: 'fadeIn 0.5s ease-out', marginBottom: '2rem',
          border: `1px solid ${result.risk_level === 'High Risk' || result.risk_level === 'Critical Risk' ? 'rgba(239,68,68,0.2)' : result.risk_level === 'Moderate Risk' ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.15rem' }}>Scan Complete</h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{file?.name}</span>
            </div>
            <div style={{ textAlign: 'right', background: 'var(--bg-main)', padding: '0.6rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: result.risk_level === 'High Risk' || result.risk_level === 'Critical Risk' ? '#EF4444' : result.risk_level === 'Moderate Risk' ? '#F59E0B' : '#10B981' }}>
                {result.legal_health_score}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>
          </div>

          {/* Clauses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10B981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={16} /> Found Clauses</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.detected_clauses.length > 0 ? result.detected_clauses.map((c, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                    <span style={{ color: '#10B981' }}>✓</span> {c}
                  </li>
                )) : <li style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None detected.</li>}
              </ul>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#EF4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertTriangle size={16} /> Missing Clauses</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {result.missing_clauses.length > 0 ? result.missing_clauses.map((c, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', gap: '0.4rem', alignItems: 'baseline' }}>
                    <span style={{ color: '#EF4444' }}>✗</span> {c}
                  </li>
                )) : <li style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>All clauses present.</li>}
              </ul>
            </div>
          </div>

          {/* Risk Flags */}
          {result.risk_flags.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#F59E0B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldAlert size={16} /> Risk Phrases</h4>
              {result.risk_flags.map((flag, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(245,158,11,0.05)', borderLeft: '3px solid #F59E0B', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{flag}</div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <span className="text-gradient">AI Recommendations</span> 💡
            </h4>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {result.recommendations.length > 0 ? result.recommendations.map((rec, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary)' }}>→</span> {rec}
                </li>
              )) : <li style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Document looks healthy.</li>}
            </ul>
          </div>
        </Card>
      )}

      {result?.error && (
        <Card style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)', marginBottom: '2rem' }}>
          <h3 style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.35rem' }}>
            <AlertTriangle size={18} /> Analysis Error
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{result.error}</p>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
