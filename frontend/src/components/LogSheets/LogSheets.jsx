import React from 'react';
import { FileText } from 'lucide-react';

const LogSheets = () => {
  return (
    <div style={{padding: '2rem'}}>
      <div className="page-header">
        <h2>Log Sheets</h2>
        <p>View and export all generated ELD log sheets</p>
      </div>
      <div className="card glass-panel" style={{padding: '3rem', textAlign: 'center', marginTop: '2rem'}}>
        <FileText size={48} style={{opacity: 0.2, marginBottom: '1rem'}} color="var(--text-secondary)" />
        <h3 style={{color: 'var(--text-secondary)'}}>Log Sheets Repository Coming Soon</h3>
        <p style={{color: 'var(--text-tertiary)'}}>This page will allow you to download PDFs of all your compliant HOS sheets.</p>
      </div>
    </div>
  );
};

export default LogSheets;
