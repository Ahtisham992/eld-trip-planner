import datetime
from typing import List, Dict, Any

def generate_daily_logs(duty_logs: List[Dict[str, Any]], cycle_used_start: float) -> List[Dict[str, Any]]:
    """
    Takes a continuous list of duty logs and splits them into midnight-to-midnight daily logs.
    """
    if not duty_logs:
        return []

    daily_logs = []
    
    current_day = 1
    # Get the date of the first event
    current_date = duty_logs[0]['start_time'].date()
    # Define midnight for the next day
    next_midnight = datetime.datetime.combine(current_date + datetime.timedelta(days=1), datetime.time.min, tzinfo=datetime.timezone.utc)
    
    current_daily_log = {
        'log_date': current_date,
        'day_number': current_day,
        'from_location': duty_logs[0]['location'],
        'to_location': "",
        'total_miles_driving': 0.0,
        'entries': []
    }
    
    # We will accumulate driving miles elsewhere, here we'll just track hours and infer average
    # Wait, the models have total_miles_driving which we can populate later or approximate
    
    for log in duty_logs:
        start_t = log['start_time']
        end_t = log['end_time']
        status = log['status']
        location = log['location']
        
        # If the log spans across midnight, split it
        while end_t > next_midnight:
            # First part: until midnight
            duration_to_midnight = (next_midnight - start_t).total_seconds() / 3600.0
            if duration_to_midnight > 0:
                current_daily_log['entries'].append({
                    'duty_status': status,
                    'start_hour': start_t.hour + start_t.minute / 60.0 + start_t.second / 3600.0,
                    'end_hour': 24.0,
                    'location': location,
                    'remarks': ''
                })
                current_daily_log['to_location'] = location
            
            # Save the current day's log
            daily_logs.append(current_daily_log)
            
            # Setup next day
            current_day += 1
            current_date += datetime.timedelta(days=1)
            next_midnight += datetime.timedelta(days=1)
            
            current_daily_log = {
                'log_date': current_date,
                'day_number': current_day,
                'from_location': location,
                'to_location': "",
                'total_miles_driving': 0.0,
                'entries': []
            }
            # Update start_t to midnight for the rest of the span
            start_t = next_midnight - datetime.timedelta(days=1)
            
        # Add remaining part of the log (or the whole log if it didn't cross midnight)
        duration_remaining = (end_t - start_t).total_seconds() / 3600.0
        if duration_remaining > 0:
            start_hour = start_t.hour + start_t.minute / 60.0 + start_t.second / 3600.0
            end_hour = end_t.hour + end_t.minute / 60.0 + end_t.second / 3600.0
            
            # If it's exactly midnight, end_hour will be 0.0, which means 24.0 for the previous day,
            # but we already handled crossing midnight above.
            if end_hour == 0.0 and duration_remaining > 0:
                end_hour = 24.0
                
            current_daily_log['entries'].append({
                'duty_status': status,
                'start_hour': start_hour,
                'end_hour': end_hour,
                'location': location,
                'remarks': ''
            })
            current_daily_log['to_location'] = location

    # Add the last day
    if current_daily_log['entries']:
        daily_logs.append(current_daily_log)
        
    return daily_logs
