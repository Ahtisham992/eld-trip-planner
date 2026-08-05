# 🗺️ Implementation Plan — ELD Trip Planner

> **Total Estimated Time:** ~14-16 hours across 7 phases  
> **Deadline:** August 8, 2026  

---

## Phase 1: Project Scaffolding & Setup (~1 hour)

### 1.1 Backend — Django Project

#### [NEW] `backend/requirements.txt`
Dependencies: Django, djangorestframework, django-cors-headers, requests, gunicorn, whitenoise, psycopg2-binary, python-dotenv

#### [NEW] `backend/config/settings.py`
- Django project configuration
- REST framework settings
- CORS configuration (allow frontend origin)
- Database config (SQLite for dev, PostgreSQL for prod via env)
- Static files with Whitenoise

#### [NEW] `backend/config/urls.py`
- Include `trips/` app URLs under `/api/`

#### [NEW] `backend/trips/` (Django app)
- Standard Django app structure with models, views, serializers, urls, services/

### 1.2 Frontend — React + Vite Project

#### [NEW] `frontend/` (Vite React app)
- Initialize with `npx create-vite@latest ./ --template react`
- Install dependencies: `react-leaflet`, `leaflet`, `axios`
- Configure Vite proxy for dev API calls

#### [NEW] `frontend/src/index.css`
- Complete design system with all CSS custom properties from the Styles & Theme guide
- Global resets, typography, utility classes

### 1.3 Verification
- `python manage.py runserver` — Django starts without errors
- `npm run dev` — React app loads in browser
- Frontend can make a test API call to backend

---

## Phase 2: Django Backend — Models & HOS Engine (~3 hours)

### 2.1 Data Models

#### [NEW] `backend/trips/models.py`
- `Trip` model: locations, coordinates, distances, route geometry, timestamps
- `TripStop` model: sequence, stop type, location, duration, duty status, times
- `DailyLog` model: date, from/to, miles, remarks, recap data
- `LogEntry` model: duty status, start/end hour, location, remarks

### 2.2 Constants & Enums

#### [NEW] `backend/utils/constants.py`
```python
# HOS Limits
MAX_DRIVING_HOURS = 11
MAX_WINDOW_HOURS = 14
MAX_HOURS_BEFORE_BREAK = 8
MANDATORY_BREAK_DURATION = 0.5  # 30 minutes
MANDATORY_REST_DURATION = 10    # 10 hours
MAX_CYCLE_HOURS = 70
CYCLE_DAYS = 8
RESTART_HOURS = 34
FUEL_INTERVAL_MILES = 1000
FUEL_STOP_DURATION = 0.5        # 30 minutes
PICKUP_DURATION = 1.0           # 1 hour
DROPOFF_DURATION = 1.0          # 1 hour
PRETRIP_DURATION = 0.25         # 15 minutes

# Duty Statuses
OFF_DUTY = "off_duty"
SLEEPER_BERTH = "sleeper_berth"
DRIVING = "driving"
ON_DUTY = "on_duty"
```

### 2.3 HOS Calculation Engine

#### [NEW] `backend/trips/services/hos_engine.py`

The core algorithm — this is the most critical piece:

```
Class HOSEngine:
    __init__(cycle_hours_used):
        Initialize state machine with all counters
    
    can_drive(hours_needed) → bool:
        Check all HOS limits
    
    get_max_drivable_hours() → float:
        Return minimum of all remaining limits
    
    drive(hours, miles):
        Update driving_hours, window_hours, hours_since_break, cycle_hours, miles_since_fuel
    
    take_break(duration):
        Update window_hours, reset hours_since_break if duration ≥ 0.5
    
    take_rest():
        Reset driving_hours, window_hours, hours_since_break
        Add rest_duration to cycle tracking
    
    on_duty_not_driving(duration):
        Update window_hours, cycle_hours
        Check if satisfies 30-min break requirement
    
    needs_fuel() → bool:
        Check miles_since_fuel ≥ 1000
    
    needs_break() → bool:
        Check hours_since_break ≥ 8
    
    needs_rest() → bool:
        Check driving_hours ≥ 11 OR window_hours ≥ 14
    
    cycle_exhausted() → bool:
        Check cycle_hours ≥ 70

    plan_trip(route_segments, stops) → List[TripEvent]:
        Main planning method that produces the full timeline
```

### 2.4 Log Generator

#### [NEW] `backend/trips/services/log_generator.py`

```
Class LogGenerator:
    generate_daily_logs(trip_events) → List[DailyLog]:
        Split timeline into midnight-to-midnight days
        For each day, create log entries
        Calculate totals, remarks, and recap data
```

### 2.5 Verification
- Write unit tests for HOSEngine:
  - Test 11-hour driving limit triggers rest
  - Test 14-hour window triggers rest
  - Test 30-minute break requirement
  - Test 70-hour cycle limit
  - Test fuel stop insertion every 1000 miles
  - Test pickup/dropoff durations
- `python manage.py test`

---

## Phase 3: Django Backend — Route Service & API (~2 hours)

### 3.1 Route Service

#### [NEW] `backend/trips/services/route_service.py`

```
Class RouteService:
    geocode(location_string) → (lat, lng, display_name):
        Call Nominatim API to convert address to coordinates
    
    get_route(origin, destination) → RouteResult:
        Call OpenRouteService directions API (driving-hgv profile)
        Return: geometry, total_distance, total_duration, steps
    
    get_location_at_distance(route, distance_miles) → (lat, lng, name):
        Interpolate a point along the route at a given distance
        Reverse geocode to get city/state name
```

### 3.2 DRF Serializers

#### [NEW] `backend/trips/serializers.py`
- `TripInputSerializer`: Validate inputs (current_location, pickup_location, dropoff_location, current_cycle_used)
- `TripStopSerializer`: Serialize stop details
- `LogEntrySerializer`: Serialize log entries
- `DailyLogSerializer`: Serialize daily log with nested entries
- `TripDetailSerializer`: Full trip response with nested stops and logs

### 3.3 API Views

#### [NEW] `backend/trips/views.py`
- `TripCreateView (POST /api/trips/)`:
  1. Validate input
  2. Geocode all locations
  3. Get routes (current→pickup, pickup→dropoff)
  4. Run HOS engine to plan stops
  5. Generate daily logs
  6. Save everything to database
  7. Return full trip response

- `TripDetailView (GET /api/trips/{id}/)`:
  1. Retrieve trip with all related stops and logs
  2. Return serialized response

- `TripListView (GET /api/trips/)`:
  1. List all trips (for trip history feature)

### 3.4 URL Configuration

#### [NEW] `backend/trips/urls.py`
```python
urlpatterns = [
    path('trips/', TripListCreateView.as_view()),
    path('trips/<int:pk>/', TripDetailView.as_view()),
]
```

### 3.5 Verification
- Test API with curl/Postman:
  - POST a trip and verify response structure
  - Verify geocoding works
  - Verify route geometry is returned
  - Verify HOS stops are calculated
  - Verify daily logs are generated
- Check multi-day trip produces multiple log sheets

---

## Phase 4: React Frontend — Form, Map & Trip Summary (~3 hours)

### 4.1 Global Styles

#### [NEW] `frontend/src/index.css`
- Complete CSS custom properties (all tokens from Styles & Theme guide)
- Global resets and base styles
- Component utility classes

### 4.2 App Layout

#### [NEW] `frontend/src/App.jsx`
- Main layout: Header + two-column (Form | Map) + Results below
- State management: tripInput, tripResult, loading, error
- Handle form submission → API call → display results

#### [NEW] `frontend/src/components/Header/Header.jsx`
- App title "ELD Trip Planner" with truck icon
- Subtitle with Spotter AI branding
- Gradient accent bar

### 4.3 Trip Input Form

#### [NEW] `frontend/src/components/TripForm/TripForm.jsx`
- Input fields with autocomplete suggestions:
  - Current Location (text with search icon)
  - Pickup Location (text with package icon)
  - Dropoff Location (text with pin icon)
  - Current Cycle Used (number slider or input, 0-70 hrs)
- Submit button with loading state
- Input validation with error messages
- Beautiful glassmorphism card design

### 4.4 Route Map

#### [NEW] `frontend/src/components/RouteMap/RouteMap.jsx`
- Leaflet map with OpenStreetMap tiles
- Draw route polyline from API geometry
- Custom markers for:
  - Start (blue), Pickup (green), Dropoff (red)
  - Rest stops (purple), Fuel stops (amber), Breaks (teal)
- Popup on each marker: stop type, duration, arrival/departure times
- Auto-fit bounds to show entire route
- Custom dark-themed map tiles (optional: CartoDB Dark Matter)

### 4.5 Trip Summary

#### [NEW] `frontend/src/components/TripSummary/TripSummary.jsx`
- Summary cards:
  - Total Distance (miles)
  - Total Duration (hours)
  - Number of Stops
  - Number of Log Sheets
- Animated number counters

#### [NEW] `frontend/src/components/StopTimeline/StopTimeline.jsx`
- Vertical timeline showing all stops in order
- Each stop: icon, name, type badge, duration, arrival time
- Color-coded by stop type
- Connecting line between stops

### 4.6 API Client

#### [NEW] `frontend/src/services/api.js`
- Axios instance with base URL from env
- `createTrip(data)` — POST /api/trips/
- `getTrip(id)` — GET /api/trips/{id}/
- Error handling wrapper

### 4.7 Verification
- Form submits successfully and shows loading state
- Map displays route with correct markers
- Summary shows accurate numbers
- Responsive layout works on different screen sizes
- Error states display properly

---

## Phase 5: ELD Log Sheet Canvas Drawing (~3 hours)

> [!IMPORTANT]
> This is the **hardest and most impressive** part of the assessment. The ELD log must be drawn programmatically on an HTML5 Canvas, matching the FMCSA daily log grid format from the [blank-paper-log.png](file:///d:/Full-stack-dev-assessment/blank-paper-log.png) reference.

### 5.1 ELD Log Sheet Component

#### [NEW] `frontend/src/components/ELDLogSheet/ELDLogSheet.jsx`

The canvas drawing logic, broken into clear functions:

```
drawLogSheet(canvas, logData):
    1. drawHeader(ctx, logData)        → Date, From/To, Carrier info
    2. drawGridBackground(ctx)         → White background, time columns
    3. drawTimeLabels(ctx)             → Midnight...Noon...Midnight
    4. drawStatusLabels(ctx)           → Off Duty, SB, Driving, On Duty
    5. drawGridLines(ctx)              → Major (hour) and minor (15-min) lines
    6. drawDutyStatusLines(ctx, entries)  → The actual driver status lines
    7. drawVerticalTransitions(ctx, entries) → Vertical connectors between status rows
    8. drawTotalHours(ctx, entries)     → Right-side totals per status
    9. drawRemarks(ctx, logData)        → Location/status change log
    10. drawRecap(ctx, logData)         → 70hr/8-day recap table
```

### 5.2 Canvas Drawing Details

**Grid coordinates mapping:**
```
Hour 0 (midnight) → x = GRID_LEFT
Hour 12 (noon)    → x = GRID_LEFT + (GRID_WIDTH / 2)  
Hour 24 (midnight)→ x = GRID_LEFT + GRID_WIDTH

Row 0 (Off Duty)  → y = GRID_TOP
Row 1 (Sleeper)    → y = GRID_TOP + ROW_HEIGHT
Row 2 (Driving)    → y = GRID_TOP + (2 * ROW_HEIGHT)
Row 3 (On Duty)    → y = GRID_TOP + (3 * ROW_HEIGHT)
```

**Drawing a duty status entry:**
```
For entry { status: "driving", start_hour: 8.25, end_hour: 14.5 }:
  - x1 = GRID_LEFT + (8.25 / 24) * GRID_WIDTH
  - x2 = GRID_LEFT + (14.5 / 24) * GRID_WIDTH
  - y  = GRID_TOP + (2 * ROW_HEIGHT) + (ROW_HEIGHT / 2)  // center of "Driving" row
  - Draw horizontal line from (x1, y) to (x2, y)
```

### 5.3 Multi-Day Log Navigation

#### [NEW] `frontend/src/components/ELDLogSheet/LogNavigation.jsx`
- Tab/pagination to switch between daily log sheets
- "Day 1", "Day 2", "Day 3", etc.
- Active tab highlighted
- Download button for each log (optional: export as PNG)

### 5.4 Verification
- Compare canvas output with [blank-paper-log.png](file:///d:/Full-stack-dev-assessment/blank-paper-log.png)
- Verify horizontal lines align with correct time positions
- Verify vertical transitions connect properly
- Verify total hours sum correctly
- Verify multi-day trips generate multiple sheets
- Test edge case: duty status spanning midnight

---

## Phase 6: Polish, UX & Testing (~1.5 hours)

### 6.1 UI Polish

- Add loading skeleton/spinner animations
- Add error boundary with retry option
- Smooth scroll to results after form submission
- Add animation to results appearing (fadeInUp)
- Add hover effects on all interactive elements
- Ensure proper focus management
- Add favicon and page title/meta

### 6.2 Responsive Design

- Test and fix layout at all breakpoints
- Ensure map is usable on smaller screens
- ELD log canvas scrollable on mobile
- Form stacks properly on mobile

### 6.3 Edge Case Testing

| Test | Input | Expected |
|---|---|---|
| Very short trip | Same city pickup/dropoff, 50 miles | 1 log sheet, no rest needed |
| Cross-country | LA to NYC, 2,800 miles | 4-5 log sheets, multiple rest/fuel |
| High cycle hours | 65 of 70 hrs used | Should hit 70-hr limit early |
| Max cycle hours | 70 hrs used | Should require 34-hr restart first |
| Same location | Current = Pickup | Skip the first leg, direct to dropoff |

### 6.4 Performance
- Lazy load map component
- Debounce location input
- Optimize canvas redraw (only redraw on data change)

---

## Phase 7: Deployment & Documentation (~1.5 hours)

### 7.1 Backend Deployment (Railway/Render)

1. Create `Procfile`: `web: gunicorn config.wsgi --bind 0.0.0.0:$PORT`
2. Set environment variables on Railway/Render
3. Run `python manage.py migrate` on production DB
4. Test API endpoint from Postman

### 7.2 Frontend Deployment (Vercel)

1. Set `VITE_API_URL` environment variable
2. Connect GitHub repo to Vercel
3. Deploy — Vercel auto-detects Vite config
4. Test deployed frontend against deployed backend

### 7.3 GitHub Repository

#### [NEW] `README.md`
```markdown
# ELD Trip Planner
Full-stack app for planning truck driver trips with HOS compliance.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Django + Django REST Framework
- **Map**: Leaflet + OpenStreetMap + OpenRouteService
- **ELD Logs**: HTML5 Canvas

## Features
- Route planning with HOS-compliant stops
- Interactive map with route visualization
- Auto-generated FMCSA-compliant ELD daily log sheets
- 70hr/8-day cycle tracking

## Setup
### Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend
cd frontend
npm install
npm run dev

## Live Demo
[link-to-vercel-deployment]

## Architecture
[Brief architecture description with diagram]
```

#### [NEW] `.gitignore`
Standard Python + Node.js gitignore

### 7.4 Loom Video (3-5 minutes)

Record covering:
1. **Demo** (1.5 min): Show the app working end-to-end with a real trip
2. **Code walkthrough** (2 min): Show HOS engine logic, Canvas drawing, API structure
3. **Architecture** (0.5 min): Explain the tech stack choices and deployment

---

## Phase Summary & Time Budget

| Phase | Description | Estimated Hours |
|---|---|---|
| 1 | Project Scaffolding & Setup | 1.0 |
| 2 | Django Backend — Models & HOS Engine | 3.0 |
| 3 | Django Backend — Route Service & API | 2.0 |
| 4 | React Frontend — Form, Map & Summary | 3.0 |
| 5 | ELD Log Sheet Canvas Drawing | 3.0 |
| 6 | Polish, UX & Testing | 1.5 |
| 7 | Deployment & Documentation | 1.5 |
| | **Total** | **15.0** |

> [!NOTE]
> 1 hour buffer from the 16-hour budget for unexpected issues.

---

## Proposed Changes Summary

### Backend (`backend/`)

| Status | File | Purpose |
|---|---|---|
| [NEW] | `requirements.txt` | Python dependencies |
| [NEW] | `config/settings.py` | Django settings |
| [NEW] | `config/urls.py` | Root URL config |
| [NEW] | `config/wsgi.py` | WSGI entry point |
| [NEW] | `trips/models.py` | Trip, Stop, DailyLog, LogEntry models |
| [NEW] | `trips/serializers.py` | DRF serializers |
| [NEW] | `trips/views.py` | API views |
| [NEW] | `trips/urls.py` | App URL patterns |
| [NEW] | `trips/services/hos_engine.py` | HOS calculation engine |
| [NEW] | `trips/services/route_service.py` | OpenRouteService integration |
| [NEW] | `trips/services/log_generator.py` | ELD log data generator |
| [NEW] | `utils/constants.py` | Constants and enums |
| [NEW] | `Procfile` | Production deployment |

### Frontend (`frontend/`)

| Status | File | Purpose |
|---|---|---|
| [NEW] | `src/index.css` | Design system and global styles |
| [NEW] | `src/App.jsx` | Main application layout |
| [NEW] | `src/components/Header/` | App header |
| [NEW] | `src/components/TripForm/` | Input form |
| [NEW] | `src/components/RouteMap/` | Leaflet map |
| [NEW] | `src/components/ELDLogSheet/` | Canvas-drawn ELD logs |
| [NEW] | `src/components/TripSummary/` | Trip stats cards |
| [NEW] | `src/components/StopTimeline/` | Visual stop timeline |
| [NEW] | `src/components/Loading/` | Loading states |
| [NEW] | `src/services/api.js` | API client |
| [NEW] | `src/utils/constants.js` | Frontend constants |

### Root

| Status | File | Purpose |
|---|---|---|
| [NEW] | `README.md` | Project documentation |
| [NEW] | `.gitignore` | Git ignore rules |

---

## Open Questions

> [!IMPORTANT]
> **Q1:** Should we assume a start time of "now" (current time) when the user submits the trip, or should we add a "Start Time" input field?
> **Recommendation:** Use current time as default, simplifies the form.

> [!IMPORTANT]
> **Q2:** For the ELD log canvas, should we also add a "Download as PDF/PNG" button for each log sheet?
> **Recommendation:** Yes — adds professionalism and is easy to implement with `canvas.toDataURL()`.

> [!IMPORTANT]
> **Q3:** Should we save trip history and allow users to view past trips?
> **Recommendation:** Yes — the database models support it and it shows full-stack competency. A simple trip list view.

---

## Verification Plan

### Automated Tests
```bash
# Backend unit tests
cd backend && python manage.py test

# Test specific scenarios
python manage.py test trips.tests.test_hos_engine
```

### Manual Verification
1. Submit a short trip (LA → San Francisco) — verify 1 log sheet
2. Submit a medium trip (LA → Portland) — verify 2 log sheets
3. Submit a cross-country trip (LA → NYC) — verify 4-5 log sheets
4. Test with high cycle hours (65 of 70) — verify early rest
5. Compare ELD canvas output with blank-paper-log.png reference
6. Test deployed version end-to-end
7. Verify responsive design on tablet screen
