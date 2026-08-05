import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, LayoutDashboard, Plus, Clock, FileText, Settings, LogOut, ChevronRight } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
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
      </div>

      <div className="sidebar-nav">
        <span className="nav-label">MENU</span>

        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
          <Plus size={20} />
          <span>New Trip</span>
        </NavLink>

        <NavLink to="/history" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Clock size={20} />
          <span>Trip History</span>
        </NavLink>

        <NavLink to="/log-sheets" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <FileText size={20} />
          <span>Log Sheets</span>
        </NavLink>

        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
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
              <span onClick={logout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <LogOut size={12} /> Logout
              </span>
            </div>
            <ChevronRight size={16} className="chevron" />
          </div>
        ) : (
          <NavLink to="/login" style={{ textDecoration: 'none' }}>
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
  );
};

export default Sidebar;
