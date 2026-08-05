# 📏 Rules & Regulations — ELD Trip Planner

This document codifies **every rule** that the application must implement. These are the source of truth for the HOS engine, route planning logic, and ELD log generation.

---

## 1. FMCSA Hours of Service (HOS) Rules

### 1.1 Applicable Driver Profile

| Parameter | Value |
|---|---|
| Driver Type | Property-carrying (CMV) |
| Cycle | 70 hours / 8 days |
| Adverse Conditions | Not applicable (per assessment) |
| Short-haul Exception | Not applicable |

### 1.2 Core HOS Limits

| Rule ID | Rule Name | Limit | Trigger | Reset Condition |
|---|---|---|---|---|
| **HOS-1** | 11-Hour Driving Limit | 11 hours max driving | After 10 consecutive hours off duty | 10 consecutive hours off duty |
| **HOS-2** | 14-Hour On-Duty Window | 14 consecutive hours | Clock starts when driver goes on duty | 10 consecutive hours off duty |
| **HOS-3** | 30-Minute Break | Required after 8 cumulative hours driving | 8 hours of driving without 30-min non-driving break | Any ≥30 min non-driving period (off duty, sleeper, on duty not driving) |
| **HOS-4** | 10-Hour Off-Duty | 10 consecutive hours required | Before next driving period | Completed when 10 consecutive hours off duty achieved |
| **HOS-5** | 70-Hour/8-Day Limit | 70 hours max on-duty in rolling 8 days | Cumulative on-duty time over rolling 8-day window | 34-hour restart (optional) |
| **HOS-6** | 34-Hour Restart | 34 consecutive hours off duty | Resets 70-hour clock completely | N/A |

### 1.3 Rule Interaction & Priority

```
Priority Order (highest first):
1. 70-Hour/8-Day Limit (HOS-5) — Cannot drive if cycle exhausted
2. 14-Hour Window (HOS-2) — Cannot drive if window expired
3. 11-Hour Driving Limit (HOS-1) — Cannot drive if driving hours exhausted
4. 30-Minute Break (HOS-3) — Must break after 8 hours driving
5. Fueling (Trip Assumption) — Must fuel every 1,000 miles
```

### 1.4 Critical Clarifications

> [!IMPORTANT]
> - The **14-hour window does NOT pause** — it runs continuously from the moment the driver goes on duty, regardless of breaks, meals, fuel stops, or any other activity. It is a fixed clock.
> - The **30-minute break** can be satisfied by ANY non-driving period ≥30 minutes: off duty, sleeper berth, or on-duty not driving.
> - **On-duty time** includes: driving, pre-trip inspection, fueling, loading/unloading, waiting. It all counts toward the 70-hour cycle.
> - **Off-duty time** does NOT count toward the 70-hour cycle but the 14-hour window still runs.

---

## 2. Duty Status Definitions

| Status Code | Status Name | Counts Toward 70hr? | Counts Toward 14hr Window? | Counts Toward 11hr Driving? |
|---|---|---|---|---|
| `OFF` | Off Duty | ❌ No | ✅ Yes (window doesn't pause) | ❌ No |
| `SB` | Sleeper Berth | ❌ No | ✅ Yes (window doesn't pause) | ❌ No |
| `D` | Driving | ✅ Yes | ✅ Yes | ✅ Yes |
| `ON` | On Duty (Not Driving) | ✅ Yes | ✅ Yes | ❌ No |

---

## 3. Trip Planning Rules

### 3.1 Trip Sequence

```
1. START at Current Location
   └─ Pre-trip inspection: 15 min (ON DUTY)

2. DRIVE to Pickup Location
   └─ Insert breaks/fuel/rest as needed per HOS rules

3. PICKUP at Pickup Location
   └─ Loading: 1 hour (ON DUTY, NOT DRIVING)

4. DRIVE to Dropoff Location
   └─ Insert breaks/fuel/rest as needed per HOS rules

5. DROPOFF at Dropoff Location
   └─ Unloading: 1 hour (ON DUTY, NOT DRIVING)

6. END — Trip Complete
```

### 3.2 Stop Insertion Rules

| Rule | Condition | Action | Duration | Duty Status |
|---|---|---|---|---|
| **30-Min Break** | 8 cumulative hours of driving since last 30+ min break | Insert rest break | 30 minutes | OFF DUTY |
| **Mandatory Rest** | 11 hours driving OR 14-hour window expired | Insert 10-hour rest | 10 hours | SLEEPER BERTH (or OFF DUTY) |
| **Fuel Stop** | Every 1,000 miles driven | Insert fuel stop | 30 minutes | ON DUTY (not driving) |
| **Pickup** | Arriving at pickup location | Loading stop | 1 hour | ON DUTY (not driving) |
| **Dropoff** | Arriving at dropoff location | Unloading stop | 1 hour | ON DUTY (not driving) |

### 3.3 Fuel Stop Logic

```
- Track cumulative miles since last fuel stop
- When miles_since_fuel ≥ 1000:
  - Insert a fuel stop at the nearest reasonable location
  - Duration: 30 minutes
  - Status: ON DUTY (not driving)
  - Reset miles_since_fuel counter
- Note: Fuel stops during rest periods or at pickup/dropoff count as fueling
```

### 3.4 Combining Stops

To optimize the trip, combine stops when possible:

- If a **30-min break** is due AND a **fuel stop** is due → combine into single 30-min stop
- If the **pickup/dropoff** (1 hour) occurs during a time when a 30-min break is also due → the pickup/dropoff satisfies the break requirement
- If a **mandatory rest** is needed AND fuel is also due → fuel during the rest period

---

## 4. ELD Log Drawing Rules

### 4.1 Grid Specifications

| Element | Specification |
|---|---|
| **Time axis** | 24 hours, midnight to midnight |
| **Time subdivisions** | Each hour divided into 4 quarter-hour (15-min) segments |
| **Row count** | 4 rows for 4 duty statuses |
| **Row order** (top to bottom) | 1. Off Duty, 2. Sleeper Berth, 3. Driving, 4. On Duty (Not Driving) |
| **Hour labels** | Mid-night, 1, 2, 3, ... 11, Noon, 1, 2, 3, ... 11, Mid-night |

### 4.2 Drawing Rules

1. **Horizontal Lines**: Draw a horizontal line across the time range for each duty status period. The line is drawn on the row corresponding to the duty status.

2. **Vertical Lines**: When duty status changes, draw a vertical line connecting the ending row of the previous status to the starting row of the new status.

3. **Line Thickness**: Duty status lines should be clearly visible (2-3px) and in a distinct color.

4. **Total Hours**: On the right edge, show the total hours spent in each duty status for that day.

5. **Time Precision**: Round to nearest 15-minute increment for grid snapping (matching the grid subdivisions).

### 4.3 Log Sheet Header Fields

Each daily log sheet must include:

| Field | Source |
|---|---|
| Date (Month/Day/Year) | Calculated from trip timeline |
| From | Starting city/state for that day |
| To | Ending city/state for that day |
| Total Miles Driving Today | Calculated from route segments driven that day |
| Total Mileage Today | Same as above for this context |
| Name of Carrier | "Spotter AI Logistics" (placeholder) |
| Main Office Address | "123 Main St, City, ST" (placeholder) |
| Home Terminal Address | Use current location |
| Truck/Tractor Number | "T-1234" (placeholder) |
| Trailer Number | "TR-5678" (placeholder) |

### 4.4 Remarks Section

For each duty status change, record:
```
{city}, {state} - {duty_status_description}
```
Example:
```
Los Angeles, CA - Pre-trip inspection
Los Angeles, CA - Begin driving
Bakersfield, CA - 30-minute rest break
San Francisco, CA - Pickup / Loading
San Francisco, CA - Begin driving
Redding, CA - 10-hour rest (mandatory)
```

### 4.5 Recap Section (70hr/8-Day)

The bottom of each log sheet shows the recap:

| Column | Description |
|---|---|
| A. Total hours on duty last 7 days | Sum of on-duty hours for the prior 7 days |
| B. Total hours available tomorrow | 70 minus total on-duty hours in rolling 8-day window |
| C. Total hours on duty today | Sum of all on-duty (including driving) hours for the current log day |

---

## 5. Multi-Day Trip Rules

### 5.1 Day Boundaries

- Each log day runs from **midnight to midnight** (00:00 – 24:00)
- If a duty status spans midnight, it appears on both days' logs
  - The ending day shows the status continuing from 00:00
  - The previous day shows the status extending to 24:00

### 5.2 Trip Day Counting

```
Day 1: Trip start time → midnight
Day 2: midnight → midnight  
Day N: midnight → trip end time
```

### 5.3 Status Carryover

- The first entry of each day (after Day 1) should begin with whatever status was active at midnight
- Remaining driving hours, 14-hour window, and cycle hours carry forward between days

---

## 6. Calculation Algorithm Overview

### 6.1 HOS State Machine

```
State Variables:
  - driving_hours_used:     float (0 → 11 max)
  - window_hours_used:      float (0 → 14 max) 
  - hours_since_break:      float (0 → 8 max, cumulative driving since last 30+ min break)
  - cycle_hours_used:       float (from input → 70 max)
  - miles_since_fuel:       float (0 → 1000 max)
  - current_status:         enum (OFF, SB, D, ON)
  - current_time:           datetime
  - current_position:       (lat, lng) on route
```

### 6.2 Algorithm Flow

```
1. Initialize state from trip input (cycle_hours_used from input)
2. Set current_time to NOW (or user-specified start time)
3. Pre-trip inspection: 15 min ON DUTY
4. Calculate route: Current → Pickup
5. For each driving segment:
   a. Check: Can I drive this segment without violating any HOS rule?
   b. Determine the MINIMUM of:
      - Remaining driving hours (11 - driving_hours_used)
      - Remaining window hours (14 - window_hours_used) 
      - Hours until 30-min break needed (8 - hours_since_break)
      - Hours until 70-hour limit (70 - cycle_hours_used)
      - Hours until fuel needed (miles_since_fuel → time based on speed)
   c. If segment fits: Drive it, update all counters
   d. If segment doesn't fit:
      - Drive until the limiting factor is hit
      - Insert appropriate stop (break, rest, fuel)
      - Resume driving
6. At Pickup: 1 hour ON DUTY
7. Calculate route: Pickup → Dropoff  
8. Repeat step 5 for Pickup→Dropoff segments
9. At Dropoff: 1 hour ON DUTY
10. Generate daily log sheets from the complete timeline
```

---

## 7. Code Quality Rules

### 7.1 Backend (Django)

- Use Django REST Framework with proper serializers
- Separate business logic into service classes (not in views)
- Use proper HTTP status codes (200, 201, 400, 404, 500)
- Include input validation with meaningful error messages
- Write docstrings for all service methods
- Keep views thin — delegate to services

### 7.2 Frontend (React)

- Functional components with hooks only (no class components)
- Proper error handling with user-friendly messages
- Loading states for all async operations
- Clean component separation (single responsibility)
- No inline styles — all styles in CSS files
- Meaningful component and variable names

### 7.3 General

- No hardcoded API URLs — use environment variables
- No console.log in production code
- Proper .gitignore (no node_modules, __pycache__, .env, db.sqlite3)
- Clear README with setup instructions
- Descriptive git commits

---

## 8. Testing Verification Rules

### 8.1 Accuracy Tests

| Test Case | Expected Behavior |
|---|---|
| Short trip (< 300 miles) | No mandatory rest, 1 log sheet, possible 30-min break |
| Medium trip (500-800 miles) | 1 mandatory rest, 2 log sheets, fuel stop |
| Long trip (> 1500 miles) | Multiple rest periods, 3+ log sheets, multiple fuel stops |
| High cycle used (65 hrs) | Should stop early due to 70-hour limit, include 34-hr restart if needed |
| Exactly 1000 miles | Should include exactly 1 fuel stop |
| 8+ hours of continuous driving | Must show 30-min break |

### 8.2 Visual Tests

| Test | Expected |
|---|---|
| Log grid alignment | Duty status lines align with 15-minute grid marks |
| Route on map | Route follows actual roads (not straight lines) |
| Stop markers | All stops visible with correct icons/colors |
| Multi-day logs | Each day has its own complete log sheet |
| Responsive layout | Map and form usable on tablet+ screens |

---

## 9. Deployment Rules

### 9.1 Frontend (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL` pointing to backend
- Custom domain or Vercel subdomain is acceptable

### 9.2 Backend (Railway/Render)

- Use Gunicorn as WSGI server
- Use Whitenoise for static files
- Set `DEBUG=False` in production
- Configure `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
- Use PostgreSQL in production
- Set proper `SECRET_KEY` (not the default)
