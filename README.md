# RouteSync ELD (Intelligent HOS Platform)

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Django](https://img.shields.io/badge/Django-5.1-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**RouteSync ELD** is an enterprise-grade full-stack web application designed to calculate optimal, FMCSA-compliant trucking routes, persist driver history securely in the cloud, and automatically generate standard daily Hours of Service (HOS) logs.

Built as part of the **Spotter AI Full-Stack Developer Assessment**.

### Live Application
- **Frontend**: [https://eld-trip-planner-jade.vercel.app/](https://eld-trip-planner-jade.vercel.app/)
- **Backend API**: [https://routesync-api-nv64.onrender.com/api/trips/](https://routesync-api-nv64.onrender.com/api/trips/)

### Demo
![Complete Trip Generation Demo](https://github.com/user-attachments/assets/cabf933c-5136-477a-b2f3-ea083a5dea86)

---

## Features

- **Automated HOS Compliance Engine**: A robust backend state machine enforcing FMCSA property-carrying rules, including:
  - 11-Hour Driving Limit
  - 14-Hour On-Duty Window
  - 30-Minute Mandatory Break (after 8 hours of driving)
  - 10-Hour Mandatory Rest
  - 70-Hour / 8-Day Cycle limit management
- **Dynamic Routing**: Integrates with Open Source Routing Machine (OSRM) and Nominatim (OpenStreetMap) to calculate real-world driving distances and durations between locations.
- **Secure Cloud Storage**: Utilizes **MongoDB Atlas** to securely persist user accounts, vehicle configurations, and complex routing history geometry.
- **JWT Authentication**: Full user registration and login securely handled via SimpleJWT.
- **Analytics Dashboard**: Tracks active drivers, total miles driven, and generates graphical mockups for HOS compliance and violations.
- **Visual Log Sheets (Canvas)**: Programmatically draws standard 24-hour FMCSA daily log sheets on an HTML5 canvas, mapping exact duty statuses (Off Duty, Sleeper Berth, Driving, On Duty) down to the minute.
- **Premium UI/UX**: A state-of-the-art glassmorphism React frontend utilizing bespoke CSS design tokens, modern micro-animations, and dynamic local storage settings persistence.
- **Dark Mode**: A comprehensive global ThemeContext that natively integrates with the user's system preferences.

---

## Architecture

The project is structured as a decoupled full-stack application:

### Backend (`/backend`)
- **Framework**: Django REST Framework (DRF)
- **Database**: MongoDB Atlas (Primary Storage) + SQLite (Auth/Relational)
- **Key Modules**:
  - `hos_engine.py`: The core state machine simulating a truck driver's shift and ensuring FMCSA compliance.
  - `route_service.py`: Handles geocoding (Nominatim) and route coordinate/distance fetching (OSRM) with robust rate-limiting and LRU caching.
  - `auth_app`: Handles JWT authentication natively integrated with React Context.

### Frontend (`/frontend`)
- **Framework**: React.js 18 (via Vite)
- **Styling**: Vanilla CSS with custom Design Tokens (CSS Variables) for a cohesive light/glass theme.
- **Key Components**:
  - `RouteMap`: Interactive map using React-Leaflet to visualize the trip path and stops.
  - `ELDLogSheet`: Custom Canvas drawing logic rendering exact ELD grids.
  - `DashboardAnalytics`: Aggregates MongoDB fleet history into actionable analytics.

---

## Getting Started

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

# Create environment file for MongoDB
echo "MONGO_URI=your_mongodb_atlas_connection_string" > .env

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

## Testing

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
