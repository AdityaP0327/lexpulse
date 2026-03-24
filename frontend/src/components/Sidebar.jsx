import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Shield, FileText, Settings, HelpCircle, CheckSquare, Gavel, LogOut, X, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  return (
    <>
    {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10 }}></div>}
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-container">
        <img src="/logo.png" alt="LexPulse Logo" style={{ height: '36px', objectFit: 'contain' }} />
        <span className="logo-text">LexPulse</span>
        <button className="mobile-only btn-icon" onClick={() => setIsOpen(false)} style={{ marginLeft: 'auto' }}>
          <X size={24} />
        </button>
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        
        <NavLink to="/vault" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          <Shield size={18} />
          <span>Documents</span>
        </NavLink>

        <NavLink to="/tasks" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          <CheckSquare size={18} />
          <span>Tasks</span>
        </NavLink>

        <NavLink to="/litigation" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
          <Gavel size={18} />
          <span>Litigation</span>
        </NavLink>
      </nav>
      
      <div className="nav-secondary" style={{ marginTop: 'auto' }}>
        <nav className="nav-menu">
          <a href="#" className="nav-item" onClick={(e) => e.preventDefault()}>
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <button className="nav-item" onClick={logout} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
