import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include the JWT token in all authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log requests in development - helpful for debugging
if (import.meta.env.DEV) {
  api.interceptors.request.use(request => {
    console.log('Appointment API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('Appointment API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('Appointment API Error:', error.response?.status, error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}

// Appointments service
const appointmentService = {
  // Get all appointments for the current user
  getAppointments: async () => {
    try {
      const response = await api.get('/web/appointments');
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get a specific appointment by ID
  getAppointment: async (id) => {
    try {
      const response = await api.get(`/web/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching appointment ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/web/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Update an existing appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(`/web/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating appointment ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/web/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting appointment ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  }
};

export default appointmentService; 