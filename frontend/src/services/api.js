import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interntrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized and not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('interntrack_token');
        localStorage.removeItem('interntrack_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Application endpoints
export const applicationService = {
  getApplications: (params) => api.get('/applications', { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  createApplication: (data) => api.post('/applications', data),
  updateApplication: (id, data) => api.put(`/applications/${id}`, data),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

// Dashboard endpoints
export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getAnalytics: () => api.get('/dashboard/analytics'),
  getRecent: () => api.get('/dashboard/recent-applications'),
};

// Interview endpoints
export const interviewService = {
  getInterviews: (params) => api.get('/interviews', { params }),
  createInterview: (data) => api.post('/interviews', data),
  updateInterview: (id, data) => api.put(`/interviews/${id}`, data),
  deleteInterview: (id) => api.delete(`/interviews/${id}`),
};

// Reminder endpoints
export const reminderService = {
  getReminders: (params) => api.get('/reminders', { params }),
  createReminder: (data) => api.post('/reminders', data),
  updateReminder: (id, data) => api.put(`/reminders/${id}`, data),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
};

// Notes endpoints
export const noteService = {
  getNotes: (params) => api.get('/notes', { params }),
  createNote: (data) => api.post('/notes', data),
  updateNote: (id, data) => api.put(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
};

// Profile endpoints
export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export default api;
