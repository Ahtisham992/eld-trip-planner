# 🚛 ELD Trip Planner

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Django](https://img.shields.io/badge/Django-5.1-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

ELD (Electronic Logging Device) Trip Planner is a full-stack web application designed to calculate optimal, FMCSA-compliant trucking routes and generate daily Hours of Service (HOS) logs.

Built as part of the **Spotter AI Full-Stack Developer Assessment**.

---

## ✨ Features

- **Automated HOS Compliance Engine**: A robust backend state machine enforcing the FMCSA property-carrying rules, including:
  - 11-Hour Driving Limit
  - 14-Hour On-Duty Window
  - 30-Minute Mandatory Break (after 8 hours of driving)
  - 10-Hour Mandatory Rest
  - 70-Hour / 8-Day Cycle limit management
- **Dynamic Routing**: Integrates with Open Source Routing Machine (OSRM) and Nominatim (OpenStreetMap) to calculate real-world driving distances and durations between locations.
- **Visual Log Sheets (Canvas)**: Programmatically draws standard 24-hour FMCSA daily log sheets on an HTML5 canvas, mapping exact duty statuses (Off Duty, Sleeper Berth, Driving, On Duty) down to the minute.
- **Sleek UI/UX**: A modern, dark-themed, glassmorphism-inspired React frontend using `lucide-react` for professional iconography and a clean tabbed layout.
- **Automated Testing**: Includes comprehensive Django Unit Tests for the HOS Engine and Vitest component testing for the React frontend.

---

## 🏗️ Architecture

The project is structured as a decoupled full-stack application:

### Backend (`/backend`)
- **Framework**: Django REST Framework (DRF)
- **Database**: SQLite (Development)
- **Key Modules**:
  - `hos_engine.py`: The core state machine simulating a truck driver's shift and ensuring FMCSA compliance.
  - `log_generator.py`: Converts continuous timeline events into discrete midnight-to-midnight `DailyLog` models.
  - `route_service.py`: Handles geocoding (Nominatim) and route coordinate/distance fetching (OSRM).

### Frontend (`/frontend`)
- **Framework**: React.js (via Vite)
- **Styling**: Vanilla CSS with custom Design Tokens (CSS Variables) for a cohesive dark theme.
- **Key Components**:
  - `RouteMap`: Interactive map using React-Leaflet to visualize the trip path and stops.
  - `ELDLogSheet`: Custom Canvas drawing logic rendering exact ELD grids.
  - `StopTimeline`: Chronological breakdown of all driving and resting phases.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/trips/`.

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`.

---

## 🧪 Testing

### Backend (Django)
The backend test suite heavily targets the complex `HOSEngine` logic.
```bash
cd backend
# Ensure virtualenv is active
python manage.py test trips.tests
```

### Frontend (React/Vitest)
```bash
cd frontend
npm run test
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
