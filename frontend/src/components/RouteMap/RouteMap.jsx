import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './RouteMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  start: createIcon('green'),
  pickup: createIcon('blue'),
  dropoff: createIcon('red'),
  rest_break: createIcon('yellow'),
  mandatory_rest: createIcon('orange'),
  fuel: createIcon('violet'),
};

const MapBoundsUpdater = ({ coordinates }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);

  return null;
};

const RouteMap = ({ trip }) => {
  if (!trip) return null;

  // Extract coordinates for Polyline
  const routeCoords = trip.route_geometry?.coordinates?.map(coord => [coord[1], coord[0]]) || [];

  return (
    <div className="map-wrapper card glass-panel">
      <div className="map-header">
        <h3>Route Map</h3>
        <div className="map-stats">
          <span className="stat-badge">{trip.total_distance_miles.toFixed(1)} miles</span>
          <span className="stat-badge">{trip.total_duration_hours.toFixed(1)} hours</span>
        </div>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={[39.8283, -98.5795]} 
          zoom={4} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {routeCoords.length > 0 && (
            <>
              <Polyline positions={routeCoords} color="var(--accent-secondary)" weight={4} opacity={0.8} />
              <MapBoundsUpdater coordinates={routeCoords} />
            </>
          )}

          {trip.stops.map((stop, index) => {
            if (!stop.latitude || !stop.longitude) return null;
            
            // Map stop_type to icon
            let iconType = 'blue';
            if (stop.stop_type === 'start') iconType = 'start';
            else if (stop.stop_type === 'pickup') iconType = 'pickup';
            else if (stop.stop_type === 'dropoff') iconType = 'dropoff';
            else if (stop.stop_type === 'rest_break') iconType = 'rest_break';
            else if (stop.stop_type === 'mandatory_rest') iconType = 'mandatory_rest';
            else if (stop.stop_type === 'fuel') iconType = 'fuel';
            
            return (
              <Marker 
                key={stop.id || index} 
                position={[stop.latitude, stop.longitude]}
                icon={icons[iconType] || icons.pickup}
              >
                <Popup>
                  <div className="map-popup">
                    <strong>Stop {stop.sequence_order}: {stop.stop_type.replace('_', ' ').toUpperCase()}</strong>
                    <br />
                    {stop.location_name}
                    <br />
                    <em>{stop.duration_hours} hours</em>
                    <br />
                    Mile: {stop.mile_marker.toFixed(1)}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default RouteMap;
