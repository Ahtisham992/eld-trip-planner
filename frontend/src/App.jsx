import React, { useState } from 'react';
import Header from './components/Header/Header';
import Loading from './components/Loading/Loading';
import TripForm from './components/TripForm/TripForm';
import RouteMap from './components/RouteMap/RouteMap';
import TripSummary from './components/TripSummary/TripSummary';
import StopTimeline from './components/StopTimeline/StopTimeline';
import ELDLogSheet from './components/ELDLogSheet/ELDLogSheet';
import { tripService } from './services/api';
import './index.css';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);

  const handleTripSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.createTrip(formData);
      setTripData(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="container main-content animate-fade-up">
        <div className="layout-grid">
          <div className="sidebar">
            <TripForm onSubmit={handleTripSubmit} loading={loading} />
          </div>
          
          <div className="main-panel">
            {loading && <Loading message="Calculating optimal HOS route..." />}
            
            {error && (
              <div className="error-message card glass-panel">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            {!loading && !tripData && !error && (
              <div className="empty-state card glass-panel">
                <span className="empty-icon">🗺️</span>
                <h3>Ready to Route</h3>
                <p>Enter your trip details to generate an HOS-compliant route and ELD logs.</p>
              </div>
            )}
            
            {tripData && !loading && (
              <div className="results-container animate-fade-up">
                <TripSummary trip={tripData} />
                <RouteMap trip={tripData} />
                <StopTimeline stops={tripData.stops} />
                
                <div className="logs-section">
                  <h3 style={{ marginBottom: '1rem' }}>Daily Logs</h3>
                  {tripData.daily_logs?.map((log, index) => (
                    <ELDLogSheet key={log.id || index} log={log} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
