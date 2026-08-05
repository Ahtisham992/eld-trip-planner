import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const LoginRequired = ({ featureName }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '2rem' }}>
      <div className="empty-state card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', width: '100%' }}>
        <div className="empty-state-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', width: '80px', height: '80px', margin: '0 auto 1rem auto', borderRadius: '50%', color: 'var(--text-secondary)' }}>
          <User size={40} />
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Login Required</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Please log in to {featureName || 'access this feature'}.
        </p>
        <Link to="/login">
          <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
             Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginRequired;
