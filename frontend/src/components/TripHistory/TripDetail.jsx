import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripService } from '../../services/api';
import { MapPin, Clock, FileText, ArrowLeft } from 'lucide-react';
import Loading from '../Loading/Loading';
import RouteMap from '../RouteMap/RouteMap';
import TripSummary from '../TripSummary/TripSummary';
import StopTimeline from '../StopTimeline/StopTimeline';
import ELDLogSheet from '../ELDLogSheet/ELDLogSheet';

const TripDetail = () => {
  const { id } = useParams();
  const [tripDoc, setTripDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [activeLogDay, setActiveLogDay] = useState(1);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await tripService.getTripHistoryDetail(id);
        setTripDoc(data);
      } catch (err) {
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <Loading message="Loading trip details..." />;
  if (error || !tripDoc) return <div style={{padding: '2rem'}}>{error || 'Trip not found'}</div>;

  const tripData = tripDoc.trip_data;

  return (
    <div style={{padding: '2rem'}}>
      <div style={{marginBottom: '1rem'}}>
        <Link to="/history" style={{display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-secondary)'}}>
          <ArrowLeft size={16} /> Back to History
        </Link>
      </div>

      <div className="results-container animate-fade-up">
        <h2 style={{margin: '0 0 1rem 0'}}>{tripDoc.driver_name ? `${tripDoc.driver_name}'s Route` : 'Saved Route'}</h2>
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
    </div>
  );
};

export default TripDetail;
