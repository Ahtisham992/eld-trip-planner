import React, { useState } from 'react';
import { Info, Code, User, Briefcase } from 'lucide-react';
import './FloatingInfo.css';

const FloatingInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-info-container">
      {isOpen && (
        <div className="info-popup animate-fade-up">
          <h3>Assessment Details</h3>
          <p>
            This application is a comprehensive ELD (Electronic Logging Device) trip planner built to demonstrate full-stack development capabilities. It handles complex routing logic, FMCSA compliance rules, and state management.
          </p>
          <div className="info-divider"></div>
          <div className="info-links">
            <a href="https://github.com/Ahtisham992" target="_blank" rel="noreferrer" className="info-link">
              <Code size={16} /> GitHub
            </a>
            <a href="https://linkedin.com/in/muhammad-ahtisham-6116ba2b2/" target="_blank" rel="noreferrer" className="info-link">
              <User size={16} /> LinkedIn
            </a>
            <a href="https://ahtisham-dev.site" target="_blank" rel="noreferrer" className="info-link">
              <Briefcase size={16} /> Portfolio
            </a>
          </div>
          <div className="info-footer">
            Built by Ahtisham as part of assessment
          </div>
        </div>
      )}
      <button
        className="floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Project Information"
      >
        <Info size={24} />
      </button>
    </div>
  );
};

export default FloatingInfo;
