import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { tripService } from '../../services/api';
import { Map, MapPin, Truck, TrendingUp, AlertTriangle } from 'lucide-react';
import Loading from '../Loading/Loading';
import './DashboardAnalytics.css';

const DashboardAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalMiles: 0,
    activeDrivers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const history = await tripService.getTripHistory();
        
        let totalMiles = 0;
        let drivers = new Set();
        
        history.forEach(trip => {
          totalMiles += trip.trip_data.total_distance_miles || 0;
          if (trip.driver_name) drivers.add(trip.driver_name);
        });

        setStats({
          totalTrips: history.length,
          totalMiles: totalMiles,
          activeDrivers: drivers.size
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{padding: '2rem'}}>
        <div className="card glass-panel" style={{padding: '3rem', textAlign: 'center'}}>
          <AlertTriangle size={48} color="var(--accent-danger)" style={{marginBottom: '1rem'}} />
          <h2>Authentication Required</h2>
          <p>You must be logged in to view the analytics dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loading message="Loading dashboard analytics..." />;

  return (
    <div className="analytics-container animate-fade-up">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your fleet's ELD compliance and trip statistics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card glass-panel">
          <div className="stat-icon-wrapper">
            <Map size={24} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Trips</span>
            <span className="stat-value">{stats.totalTrips}</span>
          </div>
        </div>

        <div className="stat-card card glass-panel">
          <div className="stat-icon-wrapper">
            <TrendingUp size={24} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Miles Driven</span>
            <span className="stat-value">{stats.totalMiles.toFixed(0)}</span>
          </div>
        </div>

        <div className="stat-card card glass-panel">
          <div className="stat-icon-wrapper">
            <Truck size={24} className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Drivers</span>
            <span className="stat-value">{stats.activeDrivers}</span>
          </div>
        </div>
      </div>
      
      <div className="analytics-details-grid" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        
        {/* Compliance Graph */}
        <div className="card glass-panel" style={{ flex: 2, padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Weekly HOS Compliance</h3>
          <div className="chart-container" style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--text-tertiary)' }}>
            {[6, 8, 10, 11, 9, 7, 5].map((hours, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '100%', 
                  height: `${(hours/11)*100}%`, 
                  background: hours >= 11 ? 'var(--accent-warning)' : 'var(--accent-primary)',
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  transition: 'height 0.5s ease'
                }}></div>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Day {idx+1}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width: '12px', height: '12px', background: 'var(--accent-primary)'}}></div> Compliant Driving</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width: '12px', height: '12px', background: 'var(--accent-warning)'}}></div> Max Limits Reached</span>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Driver Leaderboard */}
          <div className="card glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Active Drivers</h3>
            <div className="leaderboard-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.activeDrivers === 0 ? (
                <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>No drivers assigned yet.</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user?.username?.substring(0,2).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>{user?.username}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{stats.totalMiles.toFixed(0)} mi driven</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HOS Violations */}
          <div className="card glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-error)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} color="var(--accent-error)" /> Violations
            </h3>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              <strong style={{ fontSize: '24px', color: 'var(--text-primary)', display: 'block', marginBottom: '0.25rem' }}>0</strong>
              Active HOS flags this week. Great job maintaining compliance!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
