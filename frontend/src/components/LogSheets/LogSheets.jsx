import React, { useState, useEffect, useContext } from 'react';
import { tripService } from '../../services/api';
import { FileText, Eye, Printer, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../Loading/Loading';
import LoginRequired from '../Auth/LoginRequired';
import './LogSheets.css';

const LogSheets = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const data = await tripService.getTripHistory();
      setHistory(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load log sheets");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoginRequired featureName="view and export your ELD log sheets" />;
  }

  if (loading) return <Loading message="Loading ELD logs..." />;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="log-sheets-container animate-fade-up">
      <div className="page-header">
        <h2>Log Sheets</h2>
        <p>View and export all generated ELD log sheets</p>
      </div>

      <div className="card glass-panel" style={{ padding: '2rem' }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3>No Log Sheets Available</h3>
            <p>Generate and save a route to view its compliance logs here.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date Generated</th>
                  <th>Driver Name</th>
                  <th>Route</th>
                  <th>Total Miles</th>
                  <th>Log Sheets</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {history.map((trip) => {
                  const logs = trip.trip_data.daily_logs || [];
                  const origin = trip.trip_data.current_location;
                  const dest = trip.trip_data.dropoff_location;
                  const driver = trip.trip_data.driver_name || 'Guest Driver';
                  const date = new Date(trip.created_at).toLocaleDateString();
                  
                  return (
                    <tr key={trip._id}>
                      <td>{date}</td>
                      <td style={{ fontWeight: 500 }}>{driver}</td>
                      <td><span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{origin} → {dest}</span></td>
                      <td>{trip.trip_data.total_distance_miles.toFixed(0)} mi</td>
                      <td><span className="badge">{logs.length} Day(s)</span></td>
                      <td>
                        <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => window.location.href = `/history/${trip._id}`}>
                          <Eye size={14} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogSheets;
