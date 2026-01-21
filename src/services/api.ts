import axios from "axios";

// Base API configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// const DEV_API_BASE_URL = "http://localhost:5000/api/v1";
const PROD_API_BASE_URL = "https://athlete-tracker-backend.onrender.com/api/v1";

export const api = axios.create({
  baseURL: PROD_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("athlete_tracker_user");
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("athlete_tracker_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
