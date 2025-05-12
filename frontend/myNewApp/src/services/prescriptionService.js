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
    console.log('Prescription API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('Prescription API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('Prescription API Error:', error.response?.status, error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}

// Prescription service
const prescriptionService = {
  // Get all prescriptions for the current user
  getPrescriptions: async () => {
    try {
      const response = await api.get('/web/prescriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get a specific prescription by ID
  getPrescription: async (id) => {
    try {
      const response = await api.get(`/web/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prescription ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Create a new prescription (for doctors or upload function)
  createPrescription: async (prescriptionData) => {
    try {
      const response = await api.post('/web/prescriptions', prescriptionData);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Update an existing prescription (for doctors)
  updatePrescription: async (id, prescriptionData) => {
    try {
      const response = await api.put(`/web/prescriptions/${id}`, prescriptionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating prescription ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Delete a prescription
  deletePrescription: async (id) => {
    try {
      const response = await api.delete(`/web/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting prescription ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Upload a prescription document (image or PDF)
  uploadPrescriptionDocument: async (prescriptionId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/web/prescriptions/${prescriptionId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading prescription document:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  }
};

export default prescriptionService; 