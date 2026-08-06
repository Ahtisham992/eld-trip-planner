import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { Settings as SettingsIcon, User, Truck, Moon, Sun, Save, Laptop } from 'lucide-react';
import LoginRequired from '../Auth/LoginRequired';
import './Settings.css';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [carrierName, setCarrierName] = useState('Swift Transportation');
  const [truckNumber, setTruckNumber] = useState('TX-9021');
  const [hosRule, setHosRule] = useState('70/8');
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.carrierName) setCarrierName(parsed.carrierName);
      if (parsed.truckNumber) setTruckNumber(parsed.truckNumber);
      if (parsed.hosRule) setHosRule(parsed.hosRule);
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    const newSettings = { carrierName, truckNumber, hosRule, theme };
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    // Simulate API delay
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 600);
  };

  if (!user) {
    return <LoginRequired featureName="access settings" />;
  }

  return (
    <div className="settings-container animate-fade-up">
      <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h2>Settings</h2>
          <p>Manage your account, carrier information, and application preferences</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saveStatus === 'saving' || saveStatus === 'saved'}
          style={{display: 'flex', alignItems: 'center', gap: '8px'}}
        >
          <Save size={16} /> 
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved Successfully' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-grid">
        {/* Profile Settings */}
        <div className="settings-card card glass-panel">
          <div className="settings-card-header">
            <User size={20} className="text-primary" />
            <h3>User Profile</h3>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="input-field" value={user ? user.username : 'Guest User'} disabled />
              <span className="input-help">Your username is managed by your organization administrator.</span>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="input-field" value={user ? `${user.username}@routesync.com` : 'guest@example.com'} disabled />
            </div>
          </div>
        </div>

        {/* Carrier Settings */}
        <div className="settings-card card glass-panel">
          <div className="settings-card-header">
            <Truck size={20} className="text-primary" />
            <h3>Carrier & Vehicle Details</h3>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Default Carrier Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={carrierName} 
                onChange={(e) => setCarrierName(e.target.value)} 
                placeholder="e.g. Swift Transportation"
              />
            </div>
            <div className="form-group">
              <label>Default Truck Number</label>
              <input 
                type="text" 
                className="input-field" 
                value={truckNumber} 
                onChange={(e) => setTruckNumber(e.target.value)} 
                placeholder="e.g. TX-9021"
              />
            </div>
            <div className="form-group">
              <label>HOS Rule Cycle</label>
              <select className="input-field" value={hosRule} onChange={(e) => setHosRule(e.target.value)}>
                <option value="70/8">70-hour / 8-day cycle</option>
                <option value="60/7">60-hour / 7-day cycle</option>
              </select>
              <span className="input-help">Select the compliance cycle your fleet operates under.</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-card card glass-panel">
          <div className="settings-card-header">
            <SettingsIcon size={20} className="text-primary" />
            <h3>App Preferences</h3>
          </div>
          <div className="settings-card-body">
            <div className="theme-toggle-group">
              <label>Interface Theme</label>
              <div className="theme-options">
                <button 
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={18} /> Light
                </button>
                <button 
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={18} /> Dark
                </button>
                <button 
                  className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                  onClick={() => setTheme('system')}
                >
                  <Laptop size={18} /> System
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
