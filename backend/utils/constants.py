# HOS Limits
MAX_DRIVING_HOURS = 11.0
MAX_WINDOW_HOURS = 14.0
MAX_HOURS_BEFORE_BREAK = 8.0
MANDATORY_BREAK_DURATION = 0.5  # 30 minutes
MANDATORY_REST_DURATION = 10.0  # 10 hours
MAX_CYCLE_HOURS = 70.0
CYCLE_DAYS = 8
RESTART_HOURS = 34.0
FUEL_INTERVAL_MILES = 1000.0
FUEL_STOP_DURATION = 0.5        # 30 minutes
PICKUP_DURATION = 1.0           # 1 hour
DROPOFF_DURATION = 1.0          # 1 hour
PRETRIP_DURATION = 0.25         # 15 minutes

# Duty Statuses
OFF_DUTY = "off_duty"
SLEEPER_BERTH = "sleeper_berth"
DRIVING = "driving"
ON_DUTY = "on_duty"

# Choices for models
DUTY_STATUS_CHOICES = [
    (OFF_DUTY, "Off Duty"),
    (SLEEPER_BERTH, "Sleeper Berth"),
    (DRIVING, "Driving"),
    (ON_DUTY, "On Duty (Not Driving)"),
]

STOP_TYPE_CHOICES = [
    ('start', 'Start / Pre-trip'),
    ('pickup', 'Pickup'),
    ('dropoff', 'Dropoff'),
    ('rest_break', '30-Minute Break'),
    ('mandatory_rest', '10-Hour Rest'),
    ('fuel', 'Fuel Stop'),
]
