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
      
      <div className="card glass-panel" style={{marginTop: '2rem', padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>
        <MapPin size={48} style={{opacity: 0.2, marginBottom: '1rem'}} />
        <h3>More analytics coming soon</h3>
        <p>Compliance graphs, HOS violation flags, and driver leaderboards will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
