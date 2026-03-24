import React, { useState, useEffect, useRef, useContext } from 'react';
import { Search, Bell, Sun, Moon, Calendar, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const TopBar = ({ toggleSidebar }) => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="mobile-only btn-icon" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-bar">
          <Search size={16} />
          <input type="text" placeholder="Search documents, alerts..." />
        </div>
      </div>
      
      <div className="topbar-actions">
        <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button className="btn-icon" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={20} />
          </button>
          
          {showNotif && (
            <div className="notification-dropdown">
               <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Notifications</h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'var(--accent-subtle)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                 <Calendar size={20} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                 <div>
                   <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.85rem', marginBottom: '0.2rem' }}>Connected to Calendar</p>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.2' }}>No deadline yet.</p>
                 </div>
               </div>
            </div>
          )}
        </div>
        
        <div className="user-profile">
          <div className="avatar">{user?.businessName?.charAt(0) || 'U'}</div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }} className="desktop-only">{user?.businessName || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
