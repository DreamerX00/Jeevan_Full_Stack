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
    console.log('Profile API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('Profile API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('Profile API Error:', error.response?.status, error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}

// User Profile service
const userProfileService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Create or update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.post('/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Helper function to format profile data for API
  formatProfileData: (formData) => {
    const { 
      firstName, 
      lastName, 
      dateOfBirth, 
      gender, 
      bloodGroup, 
      height, 
      weight, 
      phone, 
      address, 
      emergencyContact,
      allergies,
      medicalConditions,
      medications 
    } = formData;
    
    // Convert string fields for allergies/conditions/medications to arrays if needed
    const formatStringToArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value.split(',').map(item => item.trim()).filter(item => item);
    };
    
    return {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      bloodGroup,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      phone,
      address,
      emergencyContact,
      allergies: formatStringToArray(allergies),
      medicalConditions: formatStringToArray(medicalConditions),
      medications: formatStringToArray(medications)
    };
  }
};

export default userProfileService; 