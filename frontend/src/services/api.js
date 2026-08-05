import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://routesync-api-nv64.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
  register: async (username, password, email) => {
    const response = await api.post('/auth/register/', { username, password, email });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const tripService = {
  createTrip: async (tripData) => {
    const response = await api.post('/trips/', tripData);
    return response.data;
  },
  getTripHistory: async () => {
    const response = await api.get('/history/');
    return response.data;
  },
  getTripHistoryDetail: async (id) => {
    const response = await api.get(`/history/${id}/`);
    return response.data;
  },
  saveTripToHistory: async (tripData) => {
    const response = await api.post('/history/save/', tripData);
    return response.data;
  },
  deleteTripFromHistory: async (id) => {
    const response = await api.delete(`/history/${id}/`);
    return response.data;
  },
  getTrips: async () => {
    const response = await api.get('/trips/');
    return response.data;
  }
};
