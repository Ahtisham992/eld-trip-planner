# 🚛 ELD Trip Planner

A full-stack web application for planning truck driver trips with **FMCSA Hours of Service (HOS)** compliance. The app takes trip details as inputs, calculates HOS-compliant routes with stops/rests/fueling, and auto-generates **Driver Daily Log Sheets (ELD Logs)**.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **Backend** | Django 5 + Django REST Framework |
| **Map** | React-Leaflet + OpenStreetMap + OpenRouteService |
| **ELD Logs** | HTML5 Canvas (programmatically drawn) |
| **Deployment** | Vercel (FE) + Railway/Render (BE) |

## ✨ Features

- **Trip Planning** — Enter current location, pickup, dropoff, and cycle hours used
- **Route Visualization** — Interactive map showing the full route with all planned stops
- **HOS Compliance** — Automatic insertion of rest breaks, fuel stops, and mandatory rest periods per FMCSA regulations
- **ELD Daily Log Sheets** — Canvas-drawn FMCSA-compliant daily log grids with duty status lines
- **Multi-Day Support** — Long trips generate multiple daily log sheets
- **70hr/8-Day Cycle Tracking** — Full cycle compliance with recap data

## 📋 HOS Rules Implemented

- 11-Hour Driving Limit
- 14-Hour On-Duty Window
- 30-Minute Rest Break (after 8 hrs driving)
- 10-Hour Off-Duty Requirement
- 70-Hour/8-Day Rolling Limit
- Fueling every 1,000 miles
- 1-hour pickup/dropoff durations

## 🚀 Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Live Demo

[Coming Soon]

## 📄 License

MIT
