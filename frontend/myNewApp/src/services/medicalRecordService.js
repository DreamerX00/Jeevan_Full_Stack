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
    console.log('Medical Record API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('Medical Record API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('Medical Record API Error:', error.response?.status, error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}

// Medical Records service
const medicalRecordService = {
  // Get all medical records for the current user
  getMedicalRecords: async () => {
    try {
      const response = await api.get('/web/medicalrecords');
      return response.data;
    } catch (error) {
      console.error('Error fetching medical records:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get a specific medical record by ID
  getMedicalRecord: async (id) => {
    try {
      const response = await api.get(`/web/medicalrecords/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical record ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get records by category
  getMedicalRecordsByCategory: async (category) => {
    try {
      const response = await api.get(`/web/medicalrecords/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical records for category ${category}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Create a new medical record
  createMedicalRecord: async (recordData) => {
    try {
      const response = await api.post('/web/medicalrecords', recordData);
      return response.data;
    } catch (error) {
      console.error('Error creating medical record:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Update an existing medical record
  updateMedicalRecord: async (id, recordData) => {
    try {
      const response = await api.put(`/web/medicalrecords/${id}`, recordData);
      return response.data;
    } catch (error) {
      console.error(`Error updating medical record ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Delete a medical record
  deleteMedicalRecord: async (id) => {
    try {
      const response = await api.delete(`/web/medicalrecords/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting medical record ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Upload a document for a medical record
  uploadMedicalDocument: async (recordId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      
      const response = await api.post(`/web/medicalrecords/${recordId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading medical document:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get all documents for a specific medical record
  getMedicalDocuments: async (recordId) => {
    try {
      const response = await api.get(`/web/medicalrecords/${recordId}/documents`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for record ${recordId}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Delete a document from a medical record
  deleteMedicalDocument: async (recordId, documentId) => {
    try {
      const response = await api.delete(`/web/medicalrecords/${recordId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting document ${documentId}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  }
};

export default medicalRecordService; 