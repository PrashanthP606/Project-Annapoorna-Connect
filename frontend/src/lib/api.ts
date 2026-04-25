// src/lib/api.ts
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: false,
});

// Attach token from localStorage automatically
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (_error) {
      // ignore (e.g. during SSR or tests)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor (optional): if 401, clear token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (_error) {
        // ignore
      }
    }
    return Promise.reject(err);
  }
);

export default api;
