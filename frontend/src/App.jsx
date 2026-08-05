import React, { useState } from 'react';
import Header from './components/Header/Header';
import Loading from './components/Loading/Loading';
import TripForm from './components/TripForm/TripForm';
import RouteMap from './components/RouteMap/RouteMap';
import TripSummary from './components/TripSummary/TripSummary';
import StopTimeline from './components/StopTimeline/StopTimeline';
import ELDLogSheet from './components/ELDLogSheet/ELDLogSheet';
import { tripService } from './services/api';
import { AlertTriangle, Map, MapPin, Clock, FileText } from 'lucide-react';
import './index.css';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [activeLogDay, setActiveLogDay] = useState(1);

  const handleTripSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.createTrip(formData);
      setTripData(data);
      setActiveTab('overview');
      setActiveLogDay(1);
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
                <AlertTriangle className="error-icon" size={24} />
                {error}
              </div>
            )}
            
            {!loading && !tripData && !error && (
              <div className="empty-state card glass-panel">
                <Map className="empty-icon" size={48} color="var(--accent-primary)" />
                <h3>Ready to Route</h3>
                <p>Enter your trip details to generate an HOS-compliant route and ELD logs.</p>
              </div>
            )}
            
            {tripData && !loading && (
              <div className="results-container animate-fade-up">
                <TripSummary trip={tripData} />
                
                <div className="tabs-container">
                  <div className="tabs-header">
                    <button 
                      className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <MapPin className="tab-icon" size={16} /> Map & Overview
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                      onClick={() => setActiveTab('timeline')}
                    >
                      <Clock className="tab-icon" size={16} /> Itinerary
                    </button>
                    <button 
                      className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                      onClick={() => setActiveTab('logs')}
                    >
                      <FileText className="tab-icon" size={16} /> ELD Logs
                    </button>
                  </div>
                  
                  <div className="tab-content">
                    {activeTab === 'overview' && (
                      <div className="tab-pane animate-fade-up">
                        <RouteMap trip={tripData} />
                      </div>
                    )}
                    
                    {activeTab === 'timeline' && (
                      <div className="tab-pane animate-fade-up">
                        <StopTimeline stops={tripData.stops} />
                      </div>
                    )}
                    
                    {activeTab === 'logs' && (
                      <div className="tab-pane animate-fade-up">
                        {tripData.daily_logs && tripData.daily_logs.length > 1 && (
                          <div className="log-day-nav">
                            <span className="log-nav-label">Select Day:</span>
                            <div className="log-day-buttons">
                              {tripData.daily_logs.map((log) => (
                                <button
                                  key={log.day_number}
                                  className={`day-btn ${activeLogDay === log.day_number ? 'active' : ''}`}
                                  onClick={() => setActiveLogDay(log.day_number)}
                                >
                                  Day {log.day_number}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {tripData.daily_logs && tripData.daily_logs.length > 0 ? (
                          <ELDLogSheet 
                            log={tripData.daily_logs.find(l => l.day_number === activeLogDay) || tripData.daily_logs[0]} 
                          />
                        ) : (
                          <div className="card glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                            <p>No ELD Logs generated for this trip.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
