import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import SmartVault from './pages/SmartVault';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        
        <main className="main-content">
          <TopBar />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vault" element={<SmartVault />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
