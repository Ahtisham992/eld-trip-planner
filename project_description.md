# 🚛 ELD Trip Planner — Full Stack Developer Assessment

> **Company:** Spotter AI  
> **Role:** Full Stack Developer  
> **Deadline:** August 8, 2026  
> **Max Time:** 4 days / 16 work hours  
> **Reward:** $100 upon successful completion  

---

## 📋 Assessment Summary

Build a **full-stack web application** using **Django** (backend) and **React** (frontend) that takes truck driver trip details as inputs, calculates an HOS-compliant route plan with stops/rests/fueling, and outputs:

1. **An interactive map** showing the route with all planned stops (rest, fuel, pickup, dropoff)
2. **Auto-generated Driver Daily Log Sheets (ELD Logs)** — visually drawn on the standard FMCSA graph grid

---

## 📥 Inputs

| Field | Description |
|---|---|
| **Current Location** | Where the driver currently is (city/address with geocoding) |
| **Pickup Location** | Where the driver picks up the load |
| **Dropoff Location** | Where the driver delivers the load |
| **Current Cycle Used (Hrs)** | How many hours of the 70-hour/8-day cycle the driver has already used |

---

## 📤 Outputs

### 1. Interactive Route Map
- Full route drawn on the map from Current → Pickup → Dropoff
- Markers for all stops: rest breaks, fuel stops, pickup, dropoff, mandatory 10-hour rest periods
- Information panels/popups showing stop type, duration, location, and cumulative hours
- Use a **free map API** (Leaflet + OpenStreetMap + OpenRouteService)

### 2. Driver Daily Log Sheets (ELD Logs)
- Must visually **draw on the standard FMCSA daily log grid** (the 24-hour graph grid)
- The grid has 4 duty status rows:
  1. **Off Duty** (Line 1)
  2. **Sleeper Berth** (Line 2)
  3. **Driving** (Line 3)
  4. **On Duty (Not Driving)** (Line 4)
- Horizontal lines and vertical connecting lines must be drawn to show status changes over the 24-hour period
- **Multiple log sheets** are generated for trips spanning multiple days
- Each log sheet must include:
  - Date (month/day/year)
  - From / To locations
  - Total Miles Driving Today
  - Total Mileage Today
  - Carrier name, office address, terminal address
  - Truck/Tractor and Trailer numbers
  - Remarks section showing city/state at each status change
  - Shipping documents info
  - Recap section showing 70hr/8day compliance

---

## ⚙️ Assumptions & Business Rules (FMCSA HOS)

### Driver Profile
- **Property-carrying driver** (not passenger)
- **70 hours / 8 days** cycle (rolling 8-day on-duty limit)
- **No adverse driving conditions** (no exceptions apply)

### Hours of Service Rules
| Rule | Limit | Description |
|---|---|---|
| **11-Hour Driving Limit** | 11 hrs | Max driving after 10 consecutive hours off duty |
| **14-Hour On-Duty Window** | 14 hrs | Cannot drive beyond 14th hour after coming on duty (window does NOT pause) |
| **30-Minute Break** | After 8 hrs driving | Must take ≥30 min break after 8 cumulative hours of driving |
| **10-Hour Off-Duty** | 10 hrs | Must take 10 consecutive hours off duty before next driving period |
| **70-Hour/8-Day Limit** | 70 hrs | Cannot drive after 70 hours on-duty in rolling 8-day period |
| **34-Hour Restart** | 34 hrs | Can reset the 70-hour clock with 34+ consecutive hours off duty |

### Trip-Specific Assumptions
| Assumption | Value |
|---|---|
| **Fueling frequency** | At least once every 1,000 miles |
| **Fueling duration** | ~30 minutes (reasonable estimate) |
| **Pickup duration** | 1 hour (On Duty, Not Driving) |
| **Dropoff duration** | 1 hour (On Duty, Not Driving) |
| **Pre-trip inspection** | 15 minutes (On Duty, Not Driving) |
| **Average speed** | Calculated from route API (typically 55-65 mph for trucks) |

---

## 📦 Deliverables

| # | Deliverable | Details |
|---|---|---|
| 1 | **Live Hosted Version** | Deployed app (Vercel for frontend, Railway/Render for Django backend) |
| 2 | **GitHub Repository** | Clean, documented code with README |
| 3 | **Loom Video** | 3-5 minute walkthrough of the app and codebase |

---

## 🎯 Evaluation Criteria

| Priority | Criteria | Notes |
|---|---|---|
| 🔴 **Critical** | Accuracy of HOS calculations | Must be up to standards — they will test the hosted version |
| 🔴 **Critical** | ELD log sheet drawing | Must visually draw on the log grid accurately |
| 🟡 **High** | UI/UX Design & Aesthetics | "Can compensate for some inaccuracies in output" — they value good design |
| 🟡 **High** | Route map with stops/rests | Must show the route and all stops clearly |
| 🟢 **Medium** | Code quality & architecture | Clean, modular, production-ready code |
| 🟢 **Medium** | Loom video clarity | Clear explanation of architecture and decisions |

---

## 📚 Reference Materials

| Resource | Description |
|---|---|
| [blank-paper-log.png](file:///d:/Full-stack-dev-assessment/blank-paper-log.png) | The exact blank ELD log sheet template to replicate |
| [fmcsa-hos-395-drivers-guide.pdf](file:///d:/Full-stack-dev-assessment/fmcsa-hos-395-drivers-guide-to-hos-2022-04-28-0-1-.pdf) | Official FMCSA HOS rules document |
| [fmsca-image.png](file:///d:/Full-stack-dev-assessment/fmsca-image.png) | FMCSA guide table of contents |
| [YouTube Reference Video](https://www.youtube.com/watch?v=whxe41XYXS8) | Provided reference video |

---

## 🧠 Key Technical Challenges

1. **HOS Engine** — Implementing the complex state machine of duty statuses with accurate time tracking across multiple days
2. **ELD Log Drawing** — Rendering the exact FMCSA graph grid with horizontal status lines and vertical transitions using HTML5 Canvas or SVG
3. **Route Planning** — Calculating where to insert mandatory stops (rest, fuel, breaks) along a real-world route
4. **Multi-Day Trips** — Handling trips that span multiple days, with each day generating its own log sheet
5. **Cycle Tracking** — Accounting for `Current Cycle Used` in the 70hr/8-day window and carrying forward across days
