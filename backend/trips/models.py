from django.db import models
from utils.constants import DUTY_STATUS_CHOICES, STOP_TYPE_CHOICES

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField(default=0.0)
    
    current_location_lat = models.FloatField(null=True, blank=True)
    current_location_lng = models.FloatField(null=True, blank=True)
    pickup_lat = models.FloatField(null=True, blank=True)
    pickup_lng = models.FloatField(null=True, blank=True)
    dropoff_lat = models.FloatField(null=True, blank=True)
    dropoff_lng = models.FloatField(null=True, blank=True)
    
    total_distance_miles = models.FloatField(default=0.0)
    total_duration_hours = models.FloatField(default=0.0)
    route_geometry = models.JSONField(null=True, blank=True) # GeoJSON
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip {self.id}: {self.current_location} -> {self.dropoff_location}"

class TripStop(models.Model):
    trip = models.ForeignKey(Trip, related_name='stops', on_delete=models.CASCADE)
    sequence_order = models.IntegerField()
    stop_type = models.CharField(max_length=50, choices=STOP_TYPE_CHOICES)
    location_name = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    duration_hours = models.FloatField(default=0.0)
    mile_marker = models.FloatField(default=0.0)
    
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duty_status = models.CharField(max_length=20, choices=DUTY_STATUS_CHOICES)

    class Meta:
        ordering = ['sequence_order']

    def __str__(self):
        return f"Stop {self.sequence_order}: {self.stop_type} at {self.location_name}"

class DailyLog(models.Model):
    trip = models.ForeignKey(Trip, related_name='daily_logs', on_delete=models.CASCADE)
    log_date = models.DateField()
    day_number = models.IntegerField()
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    total_miles_driving = models.FloatField(default=0.0)
    total_mileage = models.FloatField(default=0.0)
    remarks = models.JSONField(default=list)
    recap_hours = models.JSONField(default=dict)

    class Meta:
        ordering = ['log_date']

    def __str__(self):
        return f"Log {self.log_date} (Day {self.day_number})"

class LogEntry(models.Model):
    daily_log = models.ForeignKey(DailyLog, related_name='entries', on_delete=models.CASCADE)
    duty_status = models.CharField(max_length=20, choices=DUTY_STATUS_CHOICES)
    start_hour = models.FloatField() # 0.0 to 24.0
    end_hour = models.FloatField()   # 0.0 to 24.0
    location = models.CharField(max_length=255)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['start_hour']

    def __str__(self):
        return f"{self.duty_status}: {self.start_hour}-{self.end_hour}"
