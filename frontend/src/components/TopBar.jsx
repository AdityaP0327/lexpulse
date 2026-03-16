import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={16} />
        <input type="text" placeholder="Search documents, alerts..." />
      </div>
      
      <div className="topbar-actions">
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        
        <div className="user-profile">
          <div className="avatar">U</div>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>User</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
