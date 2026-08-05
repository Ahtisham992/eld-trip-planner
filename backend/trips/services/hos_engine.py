import datetime
from typing import List, Dict, Any
from utils import constants

class HOSEngine:
    """
    State machine and calculator for FMCSA Hours of Service compliance.
    """
    def __init__(self, start_time: datetime.datetime, current_cycle_used: float = 0.0):
        # Time and position tracking
        self.current_time = start_time
        self.current_status = constants.OFF_DUTY
        
        # HOS Limit tracking
        self.driving_hours_used = 0.0
        self.window_hours_used = 0.0
        self.hours_since_break = 0.0
        self.cycle_hours_used = current_cycle_used
        
        # Trip specific tracking
        self.miles_since_fuel = 0.0
        self.total_distance = 0.0
        self.total_duration = 0.0
        
        # Timeline of stops and events
        self.stops: List[Dict[str, Any]] = []
        # Complete contiguous log of duty status
        self.duty_logs: List[Dict[str, Any]] = []

    def _add_duty_log(self, status: str, duration: float, location: str):
        if duration <= 0:
            return
            
        start_time = self.current_time
        end_time = start_time + datetime.timedelta(hours=duration)
        
        self.duty_logs.append({
            'status': status,
            'duration': duration,
            'start_time': start_time,
            'end_time': end_time,
            'location': location
        })
        
        self.current_time = end_time
        self.current_status = status
        self.total_duration += duration

    def _add_event(self, stop_type: str, status: str, duration: float, name: str, lat: float = None, lng: float = None):
        """Add an event to the timeline and update clocks."""
        start_time = self.current_time
        
        # 1. Log the duty status period
        self._add_duty_log(status, duration, name)
        
        # 2. Add to stops
        event = {
            'stop_type': stop_type,
            'duty_status': status,
            'duration_hours': duration,
            'location_name': name,
            'latitude': lat,
            'longitude': lng,
            'start_time': start_time,
            'end_time': self.current_time,
            'mile_marker': self.total_distance
        }
        self.stops.append(event)
        
        # 3. Update clocks based on status
        if self.window_hours_used > 0 or status in [constants.DRIVING, constants.ON_DUTY]:
            self.window_hours_used += duration
            
        if status == constants.DRIVING:
            self.driving_hours_used += duration
            self.hours_since_break += duration
            self.cycle_hours_used += duration
        elif status == constants.ON_DUTY:
            self.cycle_hours_used += duration
            if duration >= constants.MANDATORY_BREAK_DURATION:
                self.hours_since_break = 0.0
        elif status in [constants.OFF_DUTY, constants.SLEEPER_BERTH]:
            if duration >= constants.MANDATORY_BREAK_DURATION:
                self.hours_since_break = 0.0
            if duration >= constants.MANDATORY_REST_DURATION:
                self.driving_hours_used = 0.0
                self.window_hours_used = 0.0
                if duration >= constants.RESTART_HOURS:
                    self.cycle_hours_used = 0.0

    def start_trip(self, location_name: str, lat: float = None, lng: float = None):
        """Initial pre-trip inspection"""
        self._add_event('start', constants.ON_DUTY, constants.PRETRIP_DURATION, location_name, lat, lng)

    def pickup(self, location_name: str, lat: float = None, lng: float = None):
        self._add_event('pickup', constants.ON_DUTY, constants.PICKUP_DURATION, location_name, lat, lng)

    def dropoff(self, location_name: str, lat: float = None, lng: float = None):
        self._add_event('dropoff', constants.ON_DUTY, constants.DROPOFF_DURATION, location_name, lat, lng)

    def take_break(self, location_name: str, lat: float = None, lng: float = None):
        self._add_event('rest_break', constants.OFF_DUTY, constants.MANDATORY_BREAK_DURATION, location_name, lat, lng)

    def take_rest(self, location_name: str, lat: float = None, lng: float = None):
        self._add_event('mandatory_rest', constants.SLEEPER_BERTH, constants.MANDATORY_REST_DURATION, location_name, lat, lng)
        self.miles_since_fuel = 0.0 

    def refuel(self, location_name: str, lat: float = None, lng: float = None):
        self._add_event('fuel', constants.ON_DUTY, constants.FUEL_STOP_DURATION, location_name, lat, lng)
        self.miles_since_fuel = 0.0

    def get_max_drivable_hours(self) -> float:
        """Returns the maximum hours the driver can drive right now."""
        if self.cycle_hours_used >= constants.MAX_CYCLE_HOURS:
            return 0.0
            
        remaining_11 = max(0.0, constants.MAX_DRIVING_HOURS - self.driving_hours_used)
        remaining_14 = max(0.0, constants.MAX_WINDOW_HOURS - self.window_hours_used)
        remaining_break = max(0.0, constants.MAX_HOURS_BEFORE_BREAK - self.hours_since_break)
        remaining_70 = max(0.0, constants.MAX_CYCLE_HOURS - self.cycle_hours_used)
        
        return min(remaining_11, remaining_14, remaining_break, remaining_70)

    def process_driving_leg(self, distance_miles: float, duration_hours: float, origin_name: str, dest_name: str):
        """Process a driving leg, breaking it up with necessary stops."""
        remaining_dist = distance_miles
        remaining_dur = duration_hours
        
        avg_speed = distance_miles / duration_hours if duration_hours > 0 else 60.0

        while remaining_dur > 0:
            max_drive = self.get_max_drivable_hours()
            
            # Check if cycle exhausted
            if self.cycle_hours_used >= constants.MAX_CYCLE_HOURS:
                self._add_event('restart', constants.OFF_DUTY, constants.RESTART_HOURS, f"En route to {dest_name}")
                continue

            # Check if we need fuel
            dist_to_fuel = constants.FUEL_INTERVAL_MILES - self.miles_since_fuel
            hours_to_fuel = dist_to_fuel / avg_speed
            
            drive_dur = min(remaining_dur, max_drive, hours_to_fuel)
            
            if drive_dur <= 0:
                if hours_to_fuel <= 0:
                    self.refuel(f"En route to {dest_name}")
                elif self.hours_since_break >= constants.MAX_HOURS_BEFORE_BREAK:
                    self.take_break(f"En route to {dest_name}")
                elif self.driving_hours_used >= constants.MAX_DRIVING_HOURS or self.window_hours_used >= constants.MAX_WINDOW_HOURS:
                    self.take_rest(f"En route to {dest_name}")
                continue

            # Drive
            drive_dist = drive_dur * avg_speed
            
            # Log driving duty
            self._add_duty_log(constants.DRIVING, drive_dur, f"En route to {dest_name}")
            
            # Update counters
            self.total_distance += drive_dist
            self.miles_since_fuel += drive_dist
            
            self.driving_hours_used += drive_dur
            self.window_hours_used += drive_dur
            self.hours_since_break += drive_dur
            self.cycle_hours_used += drive_dur
            
            remaining_dur -= drive_dur
            remaining_dist -= drive_dist
            
            # Check limits after driving
            if remaining_dur > 0:
                if self.miles_since_fuel >= constants.FUEL_INTERVAL_MILES:
                    self.refuel(f"En route to {dest_name}")
                elif self.hours_since_break >= constants.MAX_HOURS_BEFORE_BREAK:
                    self.take_break(f"En route to {dest_name}")
                elif self.driving_hours_used >= constants.MAX_DRIVING_HOURS or self.window_hours_used >= constants.MAX_WINDOW_HOURS:
                    self.take_rest(f"En route to {dest_name}")

    def get_stops(self) -> List[Dict[str, Any]]:
        return self.stops
        
    def get_duty_logs(self) -> List[Dict[str, Any]]:
        return self.duty_logs
