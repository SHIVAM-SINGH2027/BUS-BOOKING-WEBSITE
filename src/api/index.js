import axios from 'axios';

// Base URL
// const API_URL = '/api';

const API_URL = 'http://localhost:3000/api';


// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const login = (email, password) => api.post('/users/login', { email, password });
export const register = (userData) => api.post('/users', userData);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);

// Bus API
export const getAllBuses = () => api.get('/buses');
export const getBusById = (id) => api.get(`/buses/${id}`);
export const createBus = (busData) => api.post('/buses', busData);
export const updateBus = (id, busData) => api.put(`/buses/${id}`, busData);
export const deleteBus = (id) => api.delete(`/buses/${id}`);

// Route API
export const getAllRoutes = () => api.get('/routes');
export const getRouteById = (id) => api.get(`/routes/${id}`);
export const searchRoutes = (searchData) => api.post('/routes/search', searchData);
export const createRoute = (routeData) => api.post('/routes', routeData);
export const updateRoute = (id, routeData) => api.put(`/routes/${id}`, routeData);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

// Booking API
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const getAllBookings = () => api.get('/bookings');
export const getMyBookings = () => api.get('/bookings/mybookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const updateBookingStatus = (id, statusData) => api.put(`/bookings/${id}`, statusData);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Dashboard API
export const getDashboardStats = () => api.get('/dashboard');
export const getRevenueStats = () => api.get('/dashboard/revenue');

// Users API (Admin)
export const getAllUsers = () => api.get('/users');

export default api;