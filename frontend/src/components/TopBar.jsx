import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Calendar } from 'lucide-react';

const TopBar = () => {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search documents, alerts..." />
      </div>
      
      <div className="topbar-actions">
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="btn-icon" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={20} />
          </button>
          
          {showNotif && (
            <div className="notification-dropdown">
               <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Notifications</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                 <Calendar size={20} color="#60A5FA" style={{ flexShrink: 0 }} />
                 <div>
                   <p style={{ color: '#E2E8F0', fontWeight: 500, fontSize: '0.85rem', marginBottom: '0.2rem' }}>Connected to Calendar</p>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.2' }}>No deadline yet.</p>
                 </div>
               </div>
            </div>
          )}
        </div>
        
        <div className="user-profile">
          <div className="avatar">U</div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>User</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
