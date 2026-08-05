import React from 'react';
import './TripSummary.css';

const TripSummary = ({ trip }) => {
  if (!trip) return null;

  return (
    <div className="summary-wrapper card glass-panel">
      <div className="summary-header">
        <h3>Trip Summary</h3>
      </div>
      
      <div className="summary-grid">
        <div className="summary-item">
          <span className="summary-label">Route</span>
          <span className="summary-value route-value">
            {trip.pickup_location} → {trip.dropoff_location}
          </span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Total Distance</span>
          <span className="summary-value">{trip.total_distance_miles.toFixed(1)} miles</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Total Duration</span>
          <span className="summary-value">{trip.total_duration_hours.toFixed(1)} hours</span>
        </div>
        
        <div className="summary-item">
          <span className="summary-label">Days Required</span>
          <span className="summary-value">{trip.daily_logs?.length || 1} days</span>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
