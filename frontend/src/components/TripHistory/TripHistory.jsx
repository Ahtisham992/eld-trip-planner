import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { tripService } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Map, MapPin, Calendar, Truck, User, Trash2 } from 'lucide-react';
import Loading from '../Loading/Loading';
import LoginRequired from '../Auth/LoginRequired';
import './TripHistory.css';

const TripHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await tripService.getTripHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load trip history');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleDelete = async (e, id) => {
    e.preventDefault(); // prevent link navigation
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      await tripService.deleteTripFromHistory(id);
      setHistory((prev) => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip");
    }
  };

  if (!user) {
    return <LoginRequired featureName="view your saved trip history" />;
  }

  if (loading) return <Loading message="Loading trip history..." />;
  
  if (error) return <div className="history-container empty"><p className="error-text">{error}</p></div>;

  if (history.length === 0) {
    return (
      <div className="history-container empty">
        <div className="empty-state card glass-panel">
          <div className="empty-state-icon">
            <Map size={48} />
          </div>
          <h3>No trips yet</h3>
          <p>Generate a new route from the dashboard and it will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container animate-fade-up">
      <div className="page-header">
        <h2>Trip History</h2>
        <p>Review your past routes and ELD logs</p>
      </div>

      <div className="history-grid">
        {history.map((trip) => (
          <Link to={`/history/${trip._id}`} key={trip._id} style={{textDecoration: 'none'}}>
            <div className="history-card card glass-panel">
              <div className="history-header">
                <span className="history-date">
                  <Calendar size={14} /> 
                  {new Date(trip.created_at).toLocaleDateString()}
                </span>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span className="history-distance">
                    {trip.trip_data.total_distance_miles.toFixed(0)} mi
                  </span>
                  <button 
                    onClick={(e) => handleDelete(e, trip._id)}
                    className="delete-btn"
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-danger)', 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            
            <div className="history-route">
              <div className="route-point">
                <MapPin size={16} />
                <span>{trip.trip_data.current_location}</span>
              </div>
              <div className="route-line"></div>
              <div className="route-point">
                <MapPin size={16} className="dest-icon" />
                <span>{trip.trip_data.dropoff_location}</span>
              </div>
            </div>

            {(trip.driver_name || trip.truck_number) && (
              <div className="history-details">
                {trip.driver_name && (
                  <div className="detail-item">
                    <User size={14} />
                    <span>{trip.driver_name}</span>
                  </div>
                )}
                {trip.truck_number && (
                  <div className="detail-item">
                    <Truck size={14} />
                    <span>Unit #{trip.truck_number}</span>
                  </div>
                )}
              </div>
            )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TripHistory;
