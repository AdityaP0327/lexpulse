import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Shield, FileText, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <img src="/logo.png" alt="LexPulse Logo" className="logo-image" />
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
