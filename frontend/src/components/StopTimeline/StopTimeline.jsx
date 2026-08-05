import React from 'react';
import './StopTimeline.css';

const getStatusColor = (status) => {
  switch (status) {
    case 'off_duty': return 'var(--accent-secondary)';
    case 'sleeper_berth': return 'var(--accent-info)';
    case 'driving': return 'var(--accent-primary)';
    case 'on_duty': return 'var(--accent-warning)';
    default: return 'var(--text-tertiary)';
  }
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timeStr) => {
  if (!timeStr) return '';
  const date = new Date(timeStr);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const StopTimeline = ({ stops }) => {
  if (!stops || stops.length === 0) return null;

  return (
    <div className="timeline-wrapper card glass-panel">
      <h3>Trip Itinerary</h3>
      
      <div className="timeline-container">
        {stops.map((stop, index) => (
          <div key={stop.id || index} className="timeline-item">
            <div className="timeline-time">
              <span className="time">{formatTime(stop.start_time)}</span>
              <span className="date">{formatDate(stop.start_time)}</span>
            </div>
            
            <div className="timeline-marker-col">
              <div 
                className="timeline-marker"
                style={{ borderColor: getStatusColor(stop.duty_status) }}
              ></div>
              {index < stops.length - 1 && <div className="timeline-line"></div>}
            </div>
            
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{stop.stop_type.replace('_', ' ').toUpperCase()}</h4>
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(stop.duty_status)}20`,
                    color: getStatusColor(stop.duty_status),
                    borderColor: `${getStatusColor(stop.duty_status)}40`
                  }}
                >
                  {stop.duty_status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="timeline-details">
                <span className="location">📍 {stop.location_name}</span>
                <span className="duration">⏳ {stop.duration_hours.toFixed(2)} hrs</span>
                <span className="miles">🛣️ Mile {stop.mile_marker.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StopTimeline;
