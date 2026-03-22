import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Shield, FileText, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container" style={{ paddingBottom: '1.5rem', justifyContent: 'center' }}>
        <img src="/logo.png" alt="LexPulse Logo" style={{ maxWidth: '180px', width: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 0 20px rgba(0, 194, 255, 0.2), 0 0 20px rgba(255, 59, 48, 0.2)' }} />
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={18} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/vault" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Shield size={18} />
          <span>Smart Vault</span>
        </NavLink>
      </nav>
      
      <div className="nav-secondary" style={{ marginTop: 'auto' }}>
        <nav className="nav-menu">
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <HelpCircle size={18} />
            <span>Support</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
