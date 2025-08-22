import axios from 'axios';

// Default API URL from environment or hardcoded fallback
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Safe storage utilities to handle localStorage errors
const safeStorage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  }
};

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
  },
  timeout: 10000 // 10 second timeout
});

// Add a request interceptor to include the JWT token in all authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = safeStorage.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      safeStorage.remove('token');
      safeStorage.remove('user');
      window.location.href = '/login';
    }
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

// Helper function to handle API calls with fallback
const makeApiCall = async (endpoint, data, method = 'post') => {
  try {
    // Try with API prefix first
    const response = await api[method](`${API_PREFIX}${endpoint}`, data);
    return response.data;
  } catch (prefixError) {
    // If API prefix fails and we have a prefix, try without it
    if (API_PREFIX && API_PREFIX !== endpoint) {
      try {
        const response = await api[method](endpoint, data);
        return response.data;
      } catch (noPrefixError) {
        // If both fail, throw the original error
        throw prefixError;
      }
    }
    // If no API prefix, just throw the original error
    throw prefixError;
  }
};

// Helper function to save auth data safely
const saveAuthData = (token, userData) => {
  const tokenSaved = safeStorage.set('token', token);
  const userSaved = safeStorage.set('user', userData);
  
  if (!tokenSaved || !userSaved) {
    console.warn('Failed to save authentication data to localStorage');
  }
  
  return tokenSaved && userSaved;
};

// Authentication service
const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await makeApiCall('/auth/register', {
        email: userData.email,
        password: userData.password
      });
      
      if (response.token) {
        saveAuthData(response.token, { email: userData.email });
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await makeApiCall('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.token) {
        saveAuthData(response.token, { email: credentials.email });
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Logout user
  logout: () => {
    // Clear all auth-related data from localStorage
    safeStorage.remove('token');
    safeStorage.remove('user');
    safeStorage.remove('refreshToken');
    safeStorage.remove('userPreferences');
    
    // Clear any session storage items
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
    
    // Clear any cookies that might be set
    try {
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
    
    // Clear any cached data
    if (window.caches) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
        }
      }).catch(error => {
        console.error('Error clearing caches:', error);
      });
    }
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    return safeStorage.get('user', null);
  },
  
  // Check if user is logged in
  isLoggedIn: () => {
    const token = safeStorage.get('token');
    if (!token) return false;
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expirationTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  },
  
  // Get user token
  getToken: () => {
    return safeStorage.get('token');
  },
  
  // Reset password request
  forgotPassword: async (email) => {
    try {
      const response = await makeApiCall('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  }
};

export default authService; 