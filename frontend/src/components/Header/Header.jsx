import React from 'react';
import { Truck } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-gradient-bar"></div>
      <div className="container header-content">
        <div className="header-logo">
          <Truck className="logo-icon" size={32} color="var(--accent-primary)" />
          <div className="logo-text">
            <h1>ELD Trip Planner</h1>
            <span className="subtitle">Spotter AI Full Stack Assessment</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
