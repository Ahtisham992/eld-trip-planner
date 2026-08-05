import React, { useState } from 'react';
import { MapPin, Package, Flag } from 'lucide-react';
import './TripForm.css';

const TripForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    current_location: 'Los Angeles, CA',
    pickup_location: 'San Francisco, CA',
    dropoff_location: 'Portland, OR',
    current_cycle_used: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'current_cycle_used' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="trip-form card glass-panel" onSubmit={handleSubmit}>
      <h2>Plan New Trip</h2>
      <p className="form-subtitle">Enter locations to generate HOS-compliant route</p>

      <div className="form-group">
        <label htmlFor="current_location">Current Location</label>
        <div className="input-wrapper">
          <MapPin className="input-icon" size={18} color="var(--text-secondary)" />
          <input
            type="text"
            id="current_location"
            name="current_location"
            className="input-field"
            value={formData.current_location}
            onChange={handleChange}
            placeholder="e.g. Los Angeles, CA"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="pickup_location">Pickup Location</label>
        <div className="input-wrapper">
          <Package className="input-icon" size={18} color="var(--text-secondary)" />
          <input
            type="text"
            id="pickup_location"
            name="pickup_location"
            className="input-field"
            value={formData.pickup_location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dropoff_location">Dropoff Location</label>
        <div className="input-wrapper">
          <Flag className="input-icon" size={18} color="var(--text-secondary)" />
          <input
            type="text"
            id="dropoff_location"
            name="dropoff_location"
            className="input-field"
            value={formData.dropoff_location}
            onChange={handleChange}
            placeholder="e.g. Portland, OR"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="current_cycle_used">Current Cycle Used (Hours)</label>
        <div className="cycle-slider-container">
          <input
            type="range"
            id="current_cycle_used"
            name="current_cycle_used"
            min="0"
            max="70"
            step="0.5"
            value={formData.current_cycle_used}
            onChange={handleChange}
            className="slider"
          />
          <div className="cycle-value">
            <span className="value-badge">{formData.current_cycle_used} hrs</span>
            <span className="max-value">/ 70</span>
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary submit-btn" disabled={loading}>
        {loading ? 'Calculating...' : 'Generate Route & Logs'}
      </button>
    </form>
  );
};

export default TripForm;
