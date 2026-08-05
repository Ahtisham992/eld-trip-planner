import datetime
from django.test import TestCase
from trips.services.hos_engine import HOSEngine
from utils import constants

class HOSEngineTests(TestCase):
    def setUp(self):
        self.start_time = datetime.datetime(2026, 8, 1, 8, 0, tzinfo=datetime.timezone.utc)
        self.engine = HOSEngine(start_time=self.start_time)

    def test_initial_state(self):
        self.assertEqual(self.engine.current_status, constants.OFF_DUTY)
        # Initially, driver can drive max 8 hours continuously before a break
        self.assertEqual(self.engine.get_max_drivable_hours(), 8.0)
        self.assertEqual(self.engine.window_hours_used, 0.0)

    def test_start_trip(self):
        self.engine.start_trip("Yard", 34.0, -118.0)
        self.assertEqual(self.engine.current_status, constants.ON_DUTY)
        self.assertEqual(self.engine.total_duration, constants.PRETRIP_DURATION)
        # Pre-trip should start the 14-hour window
        self.assertEqual(self.engine.window_hours_used, constants.PRETRIP_DURATION)
        
    def test_driving_limits(self):
        self.engine.start_trip("Yard")
        
        # Drive for 8 hours (should hit the 8-hour break limit)
        self.engine.process_driving_leg(8 * 60, 8.0, "Yard", "City A")
        
        # Max drivable should be 0 because 8 hours since last break
        self.assertEqual(self.engine.hours_since_break, 8.0)
        self.assertEqual(self.engine.get_max_drivable_hours(), 0.0)
        
        # Taking a break should reset the break clock
        self.engine.take_break("Rest Stop")
        self.assertEqual(self.engine.hours_since_break, 0.0)
        
        # Now we should have 3 hours of driving left (11 total)
        self.assertEqual(self.engine.get_max_drivable_hours(), 3.0)
        
        # Drive the remaining 3 hours
        self.engine.process_driving_leg(3 * 60, 3.0, "Rest Stop", "City B")
        self.assertEqual(self.engine.driving_hours_used, 11.0)
        self.assertEqual(self.engine.get_max_drivable_hours(), 0.0)

    def test_14_hour_window(self):
        self.engine.start_trip("Yard")
        
        # On duty for 5 hours
        self.engine._add_event('misc', constants.ON_DUTY, 5.0, "Misc work")
        
        # Window used: 5.25 hours (including pre-trip). Driving used: 0
        self.assertEqual(self.engine.window_hours_used, 5.25)
        self.assertEqual(self.engine.driving_hours_used, 0.0)
        
        # Max continuous drivable should be limited by the 8 hour rule first
        self.assertEqual(self.engine.get_max_drivable_hours(), 8.0)
        
    def test_10_hour_rest_resets_clocks(self):
        self.engine.start_trip("Yard")
        # Drive 8 hours, take break, drive 3 hours
        self.engine.process_driving_leg(11 * 60, 11.0, "Yard", "City A")
        
        self.assertEqual(self.engine.get_max_drivable_hours(), 0.0)
        
        self.engine.take_rest("Truck Stop")
        
        # 10-hour rest should reset clocks
        self.assertEqual(self.engine.driving_hours_used, 0.0)
        self.assertEqual(self.engine.window_hours_used, 0.0)
        self.assertEqual(self.engine.get_max_drivable_hours(), 8.0)
