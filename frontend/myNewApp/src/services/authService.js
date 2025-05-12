import axios from 'axios';

// Default API URL from environment or hardcoded fallback
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Check if we need to include the /api prefix
// This is determined by comparing our API_URL to the current window location
const determineApiPrefix = () => {
  if (typeof window === 'undefined') return '';
  
  // If we're running on the same domain as the API, we need to include the /api prefix
  if (window.location.hostname === 'localhost' || 
      API_URL.includes(window.location.hostname)) {
    return '/api';
  }
  
  // If we're accessing an external domain for the API, it likely already includes
  // any necessary context path in the API_URL
  return '';
};

const API_PREFIX = determineApiPrefix();

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
    const token = localStorage.getItem('token');
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
    console.log('API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('API Error:', error.response?.status, error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}

// Authentication service
const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      // Try with API prefix first
      try {
        const response = await api.post(`${API_PREFIX}/auth/register`, {
          email: userData.email,
          password: userData.password
        });
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({
            email: userData.email
          }));
        }
        
        return response.data;
      } catch (prefixError) {
        // If API prefix fails, try without it
        if (API_PREFIX) {
          const response = await api.post('/auth/register', {
            email: userData.email,
            password: userData.password
          });
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
              email: userData.email
            }));
          }
          
          return response.data;
        }
        
        // If no API prefix, just throw the original error
        throw prefixError;
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      // Try with API prefix first
      try {
        const response = await api.post(`${API_PREFIX}/auth/login`, {
          email: credentials.email,
          password: credentials.password
        });
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({
            email: credentials.email
          }));
        }
        
        return response.data;
      } catch (prefixError) {
        // If API prefix fails, try without it
        if (API_PREFIX) {
          const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password
          });
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
              email: credentials.email
            }));
          }
          
          return response.data;
        }
        
        // If no API prefix, just throw the original error
        throw prefixError;
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  // Get user token
  getToken: () => {
    return localStorage.getItem('token');
  },
  
  // Reset password request
  forgotPassword: async (email) => {
    try {
      // Try with API prefix first
      try {
        const response = await api.post(`${API_PREFIX}/auth/forgot-password`, { email });
        return response.data;
      } catch (prefixError) {
        // If API prefix fails, try without it
        if (API_PREFIX) {
          const response = await api.post('/auth/forgot-password', { email });
          return response.data;
        }
        
        // If no API prefix, just throw the original error
        throw prefixError;
      }
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  }
};

export default authService; 