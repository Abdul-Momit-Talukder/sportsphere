import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const venueAPI = {
  getAll: (params) => api.get('/venues', { params }),
  getById: (id) => api.get(`/venues/${id}`),
  getAllAdmin: () => api.get('/venues/admin/all'),
  create: (formData) =>
    api.post('/venues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, formData) =>
    api.put(`/venues/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => api.delete(`/venues/${id}`),
};

export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  getAvailableSlots: (venueId, date) =>
    api.get('/bookings/slots', { params: { venueId, date } }),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default api;
