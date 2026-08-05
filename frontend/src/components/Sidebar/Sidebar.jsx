import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, LayoutDashboard, Plus, Clock, FileText, Settings, LogOut, ChevronRight, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-backdrop ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon" style={{ background: 'transparent' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
            </div>
            <div className="logo-text">
              <h1>RouteSync ELD</h1>
              <p>Intelligent HOS Platform</p>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-nav">
          <span className="nav-label">MENU</span>

          <NavLink to="/dashboard" onClick={onClose} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/" onClick={onClose} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
            <Plus size={20} />
            <span>New Trip</span>
          </NavLink>

          <NavLink to="/history" onClick={onClose} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Clock size={20} />
            <span>Trip History</span>
          </NavLink>

          <NavLink to="/log-sheets" onClick={onClose} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FileText size={20} />
            <span>Log Sheets</span>
          </NavLink>

          <NavLink to="/settings" onClick={onClose} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>

        <div className="sidebar-footer">
          {user ? (
            <div className="user-profile">
              <div className="avatar">{user.username.substring(0, 2).toUpperCase()}</div>
              <div className="user-info">
                <strong>{user.username}</strong>
                <span onClick={() => { logout(); onClose(); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <LogOut size={12} /> Logout
                </span>
              </div>
              <ChevronRight size={16} className="chevron" />
            </div>
          ) : (
            <NavLink to="/login" onClick={onClose} style={{ textDecoration: 'none' }}>
              <div className="user-profile" style={{ cursor: 'pointer' }}>
                <div className="avatar">?</div>
                <div className="user-info">
                  <strong>Guest User</strong>
                  <span style={{ color: 'var(--primary)' }}>Sign in</span>
                </div>
                <ChevronRight size={16} className="chevron" />
              </div>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
