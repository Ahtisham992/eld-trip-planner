import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu } from 'lucide-react';
import NewTrip from './components/NewTrip/NewTrip';
import DashboardAnalytics from './components/DashboardAnalytics/DashboardAnalytics';
import TripHistory from './components/TripHistory/TripHistory';
import TripDetail from './components/TripHistory/TripDetail';
import LogSheets from './components/LogSheets/LogSheets';
import Settings from './components/Settings/Settings';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Sidebar from './components/Sidebar/Sidebar';
import FloatingInfo from './components/FloatingInfo/FloatingInfo';
import './index.css';
import './App.css';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-logo">
          <img src="/logo.png" alt="RouteSync Logo" style={{ width: '28px', height: '28px' }} />
          <h2>RouteSync</h2>
        </div>
        <button className="hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle Menu">
          <Menu size={24} />
        </button>
      </header>

      <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<NewTrip />} />
          <Route path="/dashboard" element={<DashboardAnalytics />} />
          <Route path="/history" element={<TripHistory />} />
          <Route path="/history/:id" element={<TripDetail />} />
          <Route path="/log-sheets" element={<LogSheets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <FloatingInfo />
    </div>
  );
}

export default App;
