import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request Interceptor: Attach Bearer token ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Handle 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════
// Auth API
// ═══════════════════════════════════════════════════════════════

export const registerUser = (data) => api.post('/api/auth/register', data);

export const loginUser = (data) => api.post('/api/auth/login', data);

// ═══════════════════════════════════════════════════════════════
// Profile API
// ═══════════════════════════════════════════════════════════════

export const getProfile = () => api.get('/api/user/profile');

export const updateProfile = (data) => api.put('/api/user/profile', data);

// ═══════════════════════════════════════════════════════════════
// Progress API
// ═══════════════════════════════════════════════════════════════

export const getProgress = () => api.get('/api/progress');

export const addProgress = (data) => api.post('/api/progress', data);

export const updateProgress = (id, data) => api.put(`/api/progress/${id}`, data);

export const deleteProgress = (id) => api.delete(`/api/progress/${id}`);

// ═══════════════════════════════════════════════════════════════
// Dashboard API
// ═══════════════════════════════════════════════════════════════

export const getDashboardSummary = () => api.get('/api/progress/summary');

export default api;
