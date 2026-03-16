import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, Lock, CheckCircle, Search, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const SmartVault = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  // Fetch documents on load
  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching docs", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', file.type.includes('pdf') ? 'PDF Document' : 'Text Document');

    try {
      await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments(); // Refresh the list
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Smart Legal Vault</h1>
          <p className="page-subtitle">Blockchain-verified secure storage for your legal assets.</p>
        </div>
      </div>

      <div className="page-grid split-layout">
        
        {/* Upload Column */}
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".pdf,.docx,.txt"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
          <div 
            className={`upload-area ${isDragging ? 'drag-active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ opacity: isUploading ? 0.5 : 1, pointerEvents: isUploading ? 'none' : 'auto' }}
          >
            <UploadCloud size={48} className="upload-icon mx-auto" style={{ display: 'block', margin: '0 auto 1rem' }} />
            <h3>{isUploading ? 'Uploading Document...' : 'Upload files'}</h3>
            <p>Drag & drop or <span className="text-gradient">browse</span> to upload securely</p>
          </div>

          <div className="card" style={{ marginTop: '1.5rem', background: 'var(--brand-gradient)', color: 'white' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Lock size={16} /> Data Security Guarantee
            </h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              All documents are end-to-end encrypted with Zero-Knowledge architecture.
            </p>
          </div>
        </div>

        {/* Documents Column */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3>Your Documents</h3>
            <div className="search-bar" style={{ background: 'var(--bg-card)', minWidth: '200px', flex: 1, maxWidth: '250px' }}>
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search vault..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.searchQuery ? e.target.searchQuery : e.target.value)}
              />
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Verification</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {documents.filter(doc => (doc.title || "").toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No documents found.
                  </td>
                </tr>
              ) : documents.filter(doc => (doc.title || "").toLowerCase().includes(searchQuery.toLowerCase())).map((doc) => (
                <tr key={doc._id}>
                  <td>
                    <div className="file-name" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <FileText size={18} className="file-icon" />
                      <span title={doc.title}>{doc.title}</span>
                    </div>
                  </td>

                  <td>
                    {doc.isBlockchainVerified ? (
                       <span className="badge badge-success" style={{ display: 'inline-flex', gap: '0.25rem' }}>
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning" style={{ display: 'inline-flex', gap: '0.25rem' }}>
                        <Clock size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SmartVault;
