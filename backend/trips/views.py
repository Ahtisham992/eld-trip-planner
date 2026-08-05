import datetime
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction

from .models import Trip, TripStop, DailyLog, LogEntry
from .serializers import TripSerializer, TripInputSerializer
from .services.route_service import RouteService
from .services.hos_engine import HOSEngine
from .services.log_generator import generate_daily_logs

class TripListCreateView(APIView):
    def get(self, request):
        trips = Trip.objects.all().order_dict('-created_at')
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        serializer = TripInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        data = serializer.validated_data
        curr_loc = data['current_location']
        pick_loc = data['pickup_location']
        drop_loc = data['dropoff_location']
        cycle_used = data['current_cycle_used']
        start_time = data.get('start_time') or timezone.now()
        
        # 1. Geocode locations
        c_lat, c_lng, c_name = RouteService.geocode(curr_loc)
        p_lat, p_lng, p_name = RouteService.geocode(pick_loc)
        d_lat, d_lng, d_name = RouteService.geocode(drop_loc)
        
        if not all([c_lat, p_lat, d_lat]):
            return Response({"error": "Failed to geocode one or more locations."}, status=status.HTTP_400_BAD_REQUEST)
            
        # 2. Get Routes
        route1 = RouteService.get_route(c_lat, c_lng, p_lat, p_lng)
        route2 = RouteService.get_route(p_lat, p_lng, d_lat, d_lng)
        
        # Combine geometry (simple concatenation for assessment purposes)
        # Assuming GeoJSON LineString coordinates
        combined_coords = route1['geometry']['coordinates'] + route2['geometry']['coordinates'][1:]
        combined_geometry = {
            "type": "LineString",
            "coordinates": combined_coords
        }
        
        # 3. Run HOS Engine
        engine = HOSEngine(start_time=start_time, current_cycle_used=cycle_used)
        
        # Pre-trip
        engine.start_trip(c_name, c_lat, c_lng)
        
        # Leg 1: Current to Pickup
        engine.process_driving_leg(route1['distance_miles'], route1['duration_hours'], c_name, p_name)
        
        # Pickup
        engine.pickup(p_name, p_lat, p_lng)
        
        # Leg 2: Pickup to Dropoff
        engine.process_driving_leg(route2['distance_miles'], route2['duration_hours'], p_name, d_name)
        
        # Dropoff
        engine.dropoff(d_name, d_lat, d_lng)
        
        # 4. Generate Logs
        daily_logs_data = generate_daily_logs(engine.get_duty_logs(), cycle_used)
        
        # 5. Save to Database
        trip = Trip.objects.create(
            current_location=curr_loc,
            pickup_location=pick_loc,
            dropoff_location=drop_loc,
            current_cycle_used=cycle_used,
            current_location_lat=c_lat,
            current_location_lng=c_lng,
            pickup_lat=p_lat,
            pickup_lng=p_lng,
            dropoff_lat=d_lat,
            dropoff_lng=d_lng,
            total_distance_miles=engine.total_distance,
            total_duration_hours=engine.total_duration,
            route_geometry=combined_geometry
        )
        
        for i, stop_data in enumerate(engine.get_stops()):
            TripStop.objects.create(
                trip=trip,
                sequence_order=i+1,
                stop_type=stop_data['stop_type'],
                location_name=stop_data['location_name'],
                latitude=stop_data['latitude'],
                longitude=stop_data['longitude'],
                duration_hours=stop_data['duration_hours'],
                mile_marker=stop_data['mile_marker'],
                start_time=stop_data['start_time'],
                end_time=stop_data['end_time'],
                duty_status=stop_data['duty_status']
            )
            
        for log_data in daily_logs_data:
            # Simple recap logic for demo purposes
            recap = {
                'hours_available_tomorrow': max(0.0, 70.0 - cycle_used - engine.cycle_hours_used), # Simplified
                'hours_used_today': sum(e['end_hour'] - e['start_hour'] for e in log_data['entries'] if e['duty_status'] in ['driving', 'on_duty'])
            }
            
            total_driving_miles = 0.0 # Would need route interpolation to be accurate per day
            if any(e['duty_status'] == 'driving' for e in log_data['entries']):
                total_driving_miles = engine.total_distance / len(daily_logs_data) # Approximation
                
            dl = DailyLog.objects.create(
                trip=trip,
                log_date=log_data['log_date'],
                day_number=log_data['day_number'],
                from_location=log_data['from_location'],
                to_location=log_data['to_location'],
                total_miles_driving=total_driving_miles,
                total_mileage=total_driving_miles,
                recap_hours=recap
            )
            
            for entry in log_data['entries']:
                LogEntry.objects.create(
                    daily_log=dl,
                    duty_status=entry['duty_status'],
                    start_hour=entry['start_hour'],
                    end_hour=entry['end_hour'],
                    location=entry['location'],
                    remarks=entry['remarks']
                )
                
        # 6. Return response
        # We need to fetch the full object again to get related items serialized correctly
        trip.refresh_from_db()
        return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)

class TripDetailView(generics.RetrieveAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
