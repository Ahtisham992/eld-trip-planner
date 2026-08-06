import React, { useState, useEffect, useContext } from 'react';
import { MapPin, Package, Flag, Clock, Loader2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './TripForm.css';

const TripForm = ({ onSubmit, loading }) => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem('currentTripForm');
    if (saved) return JSON.parse(saved);
    return {
      current_location: 'Los Angeles, CA',
      pickup_location: 'San Francisco, CA',
      dropoff_location: 'Portland, OR',
      current_cycle_used: 0,
      start_time: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      driver_name: '',
      co_driver: '',
      carrier_name: '',
      truck_number: ''
    };
  });

  useEffect(() => {
    sessionStorage.setItem('currentTripForm', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    // Auto-populate from user and settings
    const savedSettings = localStorage.getItem('appSettings');
    let carrier = '';
    let truck = '';
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      carrier = parsed.carrierName || '';
      truck = parsed.truckNumber || '';
    }

    setFormData(prev => ({
      ...prev,
      driver_name: user ? user.username : '',
      carrier_name: carrier,
      truck_number: truck
    }));
  }, [user]);

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
    <form className="trip-form-container card glass-panel" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Trip details</h2>
        <p>Enter the route and your current cycle usage — we'll calculate a compliant HOS plan.</p>
      </div>

      <div className="form-grid">
        {/* Row 1 */}
        <div className="form-group full-width">
          <label htmlFor="current_location">Current location</label>
          <div className="input-wrapper">
            <MapPin className="input-icon" size={16} />
            <input
              type="text"
              id="current_location"
              name="current_location"
              value={formData.current_location}
              onChange={handleChange}
              placeholder="City, State"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="form-group half-width">
          <label htmlFor="pickup_location">Pickup location</label>
          <div className="input-wrapper">
            <Package className="input-icon" size={16} />
            <input
              type="text"
              id="pickup_location"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="City, State"
              required
            />
          </div>
        </div>

        <div className="form-group half-width">
          <label htmlFor="dropoff_location">Drop-off location</label>
          <div className="input-wrapper">
            <Flag className="input-icon" size={16} />
            <input
              type="text"
              id="dropoff_location"
              name="dropoff_location"
              value={formData.dropoff_location}
              onChange={handleChange}
              placeholder="City, State"
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="form-group third-width">
          <label>Estimated miles</label>
          <div className="input-wrapper disabled-wrapper">
            <input type="text" disabled placeholder="Generated from route" />
          </div>
        </div>

        <div className="form-group third-width">
          <label htmlFor="current_cycle_used">Current cycle used (hrs)</label>
          <div className="input-wrapper">
            <Clock className="input-icon" size={16} />
            <input
              type="number"
              id="current_cycle_used"
              name="current_cycle_used"
              min="0"
              max="70"
              step="0.5"
              value={formData.current_cycle_used}
              onChange={handleChange}
              placeholder="0-70"
            />
          </div>
        </div>

        <div className="form-group third-width">
          <label>Departure time</label>
          <div className="input-wrapper">
            <input 
              type="datetime-local" 
              name="start_time"
              value={formData.start_time || formData.departure_time || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="section-divider">
        <span className="section-label">DRIVER & VEHICLE</span>
      </div>

      <div className="form-grid quarter-grid">
        <div className="form-group">
          <label>Driver name</label>
          <input 
            type="text" 
            name="driver_name"
            value={formData.driver_name}
            onChange={handleChange}
            placeholder="Full name" 
          />
        </div>
        <div className="form-group">
          <label>Co-driver (optional)</label>
          <input 
            type="text" 
            name="co_driver"
            value={formData.co_driver}
            onChange={handleChange}
            placeholder="Full name" 
          />
        </div>
        <div className="form-group">
          <label>Carrier name</label>
          <input 
            type="text" 
            name="carrier_name"
            value={formData.carrier_name}
            onChange={handleChange}
            placeholder="Company" 
          />
        </div>
        <div className="form-group">
          <label>Truck number</label>
          <input 
            type="text" 
            name="truck_number"
            value={formData.truck_number}
            onChange={handleChange}
            placeholder="Unit #" 
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '1.5rem', padding: '12px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} 
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <MapPin size={18} />
        )}
        {loading ? 'Calculating Route...' : 'Calculate Route'}
      </button>
    </form>
  );
};

export default TripForm;
