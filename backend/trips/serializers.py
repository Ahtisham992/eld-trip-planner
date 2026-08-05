from rest_framework import serializers
from .models import Trip, TripStop, DailyLog, LogEntry

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = ['id', 'duty_status', 'start_hour', 'end_hour', 'location', 'remarks']

class DailyLogSerializer(serializers.ModelSerializer):
    entries = LogEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = DailyLog
        fields = ['id', 'log_date', 'day_number', 'from_location', 'to_location', 
                  'total_miles_driving', 'total_mileage', 'remarks', 'recap_hours', 'entries']

class TripStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripStop
        fields = ['id', 'sequence_order', 'stop_type', 'location_name', 
                  'latitude', 'longitude', 'duration_hours', 'mile_marker', 
                  'start_time', 'end_time', 'duty_status']

class TripSerializer(serializers.ModelSerializer):
    stops = TripStopSerializer(many=True, read_only=True)
    daily_logs = DailyLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = ['id', 'current_location', 'pickup_location', 'dropoff_location', 
                  'current_cycle_used', 'current_location_lat', 'current_location_lng', 
                  'pickup_lat', 'pickup_lng', 'dropoff_lat', 'dropoff_lng', 
                  'total_distance_miles', 'total_duration_hours', 'route_geometry', 
                  'created_at', 'stops', 'daily_logs']

class TripInputSerializer(serializers.Serializer):
    current_location = serializers.CharField(max_length=255)
    pickup_location = serializers.CharField(max_length=255)
    dropoff_location = serializers.CharField(max_length=255)
    current_cycle_used = serializers.FloatField(min_value=0.0, max_value=70.0, default=0.0)
    start_time = serializers.DateTimeField(required=False)
