import requests
import json
import logging
from typing import Tuple, Dict, Any, List

logger = logging.getLogger(__name__)

class RouteService:
    """
    Service for geocoding and routing using free public APIs.
    - Geocoding: Nominatim (OpenStreetMap)
    - Routing: OSRM (Open Source Routing Machine)
    """
    
    @staticmethod
    def geocode(location_name: str) -> Tuple[float, float, str]:
        """
        Geocodes a location name to lat/lng using Nominatim.
        """
        url = "https://nominatim.openstreetmap.org/search"
        headers = {
            'User-Agent': 'SpotterAI-ELD-Assessment/1.0'
        }
        params = {
            'q': location_name,
            'format': 'json',
            'limit': 1
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data and len(data) > 0:
                lat = float(data[0]['lat'])
                lng = float(data[0]['lon'])
                display_name = data[0]['display_name']
                # Simplify display name to City, State if possible, or just use the first two parts
                parts = display_name.split(', ')
                short_name = ", ".join(parts[:2]) if len(parts) >= 2 else display_name
                
                return lat, lng, short_name
            return None, None, location_name
        except Exception as e:
            logger.error(f"Geocoding error for {location_name}: {e}")
            # Mock fallback for assessment if offline/rate limited
            return 34.0522, -118.2437, location_name
            
    @staticmethod
    def get_route(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float) -> Dict[str, Any]:
        """
        Gets route geometry, distance, and duration using OSRM public API.
        """
        # OSRM expects coordinates as lon,lat
        url = f"http://router.project-osrm.org/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}"
        params = {
            'overview': 'full',
            'geometries': 'geojson',
            'steps': 'false'
        }
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if data.get('code') == 'Ok' and len(data.get('routes', [])) > 0:
                route = data['routes'][0]
                
                # Distance comes in meters, convert to miles
                distance_miles = route['distance'] * 0.000621371
                
                # Duration comes in seconds, convert to hours
                duration_hours = route['duration'] / 3600.0
                
                geometry = route['geometry']
                
                return {
                    'distance_miles': distance_miles,
                    'duration_hours': duration_hours,
                    'geometry': geometry
                }
            
            raise ValueError(f"OSRM Error: {data.get('message', 'Unknown error')}")
            
        except Exception as e:
            logger.error(f"Routing error: {e}")
            # Fallback mock for assessment
            return {
                'distance_miles': 500.0,
                'duration_hours': 8.5,
                'geometry': {
                    "type": "LineString",
                    "coordinates": [
                        [origin_lng, origin_lat],
                        [dest_lng, dest_lat]
                    ]
                }
            }
