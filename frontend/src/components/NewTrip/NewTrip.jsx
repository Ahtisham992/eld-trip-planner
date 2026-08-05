import React, { useState } from 'react';
import Loading from '../Loading/Loading';
import TripForm from '../TripForm/TripForm';
import RouteMap from '../RouteMap/RouteMap';
import TripSummary from '../TripSummary/TripSummary';
import StopTimeline from '../StopTimeline/StopTimeline';
import ELDLogSheet from '../ELDLogSheet/ELDLogSheet';
import { tripService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { AlertTriangle, Map, MapPin, Clock, FileText, Check, Save } from 'lucide-react';

const NewTrip = () => {
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  
  const { user } = React.useContext(AuthContext);

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

  const handleSaveTrip = async () => {
    if (!tripData || !user) return;
    
    setSaveStatus('saving');
    try {
      await tripService.saveTripToHistory({
        trip_data: tripData,
        // Grab these from form if needed, or they are passed down? 
        // We'll just save the raw trip data as is for now.
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error('Failed to save', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="new-trip-container animate-fade-up">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h2>New Trip Planner</h2>
        <p>Plan compliant routes and automatically generate FMCSA log sheets.</p>
      </div>

      <div className="layout-grid">
        <div className="form-panel">
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
            <div className="empty-state-icon">
              <Map size={48} />
            </div>
            <h3>Ready to plan a trip</h3>
            <p>Fill out the form on the left to generate an FMCSA-compliant Hours of Service routing plan.</p>
            
            <div className="empty-state-features">
              <div className="feature-item">
                <div className="feature-icon"><Check size={16}/></div>
                <span>Predictive ETA calculations</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Check size={16}/></div>
                <span>Automatic 30-min break scheduling</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Check size={16}/></div>
                <span>10-hour sleeper berth planning</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Check size={16}/></div>
                <span>Compliance with 11/14/70 rules</span>
              </div>
            </div>

            <button className="empty-submit-btn" onClick={() => {
              document.querySelector('.form-panel')?.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => document.getElementById('origin')?.focus(), 500);
            }}>
              <MapPin size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
              Choose a Route
            </button>
            <p className="empty-footer">
              Plans assume 55 mph average and a property-carrying driver<br />under the 70-hour / 8-day cycle.
            </p>
          </div>
        )}

        {tripData && !loading && (
          <div className="results-container animate-fade-up">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0}}>Route Generated</h3>
              {user && (
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveTrip} 
                  disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                  style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px'}}
                >
                  <Save size={16} /> 
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved to History' : 'Save Route'}
                </button>
              )}
            </div>
            
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
                    <ELDLogSheet 
                      log={tripData.daily_logs.find(l => l.day_number === activeLogDay)} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default NewTrip;
