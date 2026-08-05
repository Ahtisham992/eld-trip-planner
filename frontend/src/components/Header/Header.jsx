import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-gradient-bar"></div>
      <div className="container header-content">
        <div className="header-logo">
          <span className="logo-icon">🚛</span>
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
