import axios from 'axios';

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

// Create an axios instance with the API base URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = safeStorage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login page
      safeStorage.remove('token');
      safeStorage.remove('user');
      window.location.href = '/login';
    }
    
    // Log error for debugging
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message
      });
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API calls with error handling
const apiCall = async (apiMethod, ...args) => {
  try {
    const response = await apiMethod(...args);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth endpoints
const AuthService = {
  login: (credentials) => apiCall(api.post, '/auth/login', credentials),
  register: (userData) => apiCall(api.post, '/auth/register', userData),
  forgotPassword: (email) => apiCall(api.post, '/auth/forgot-password', { email }),
  resetPassword: (data) => apiCall(api.post, '/auth/reset-password', data),
};

// User profile endpoints
const UserService = {
  getProfile: () => apiCall(api.get, '/user/profile'),
  updateProfile: (data) => apiCall(api.put, '/user/profile', data),
};

// Appointment endpoints
const AppointmentService = {
  getAppointments: () => apiCall(api.get, '/web/appointments'),
  getAppointment: (id) => apiCall(api.get, `/web/appointments/${id}`),
  createAppointment: (data) => apiCall(api.post, '/web/appointments', data),
  updateAppointment: (id, data) => apiCall(api.put, `/web/appointments/${id}`, data),
  deleteAppointment: (id) => apiCall(api.delete, `/web/appointments/${id}`),
};

// Prescription endpoints
const PrescriptionService = {
  getPrescriptions: () => apiCall(api.get, '/web/prescriptions'),
  getPrescription: (id) => apiCall(api.get, `/web/prescriptions/${id}`),
  createPrescription: (data) => apiCall(api.post, '/web/prescriptions', data),
  updatePrescription: (id, data) => apiCall(api.put, `/web/prescriptions/${id}`, data),
  deletePrescription: (id) => apiCall(api.delete, `/web/prescriptions/${id}`),
};

// Medical records endpoints
const MedicalRecordService = {
  getMedicalRecords: () => apiCall(api.get, '/web/medicalrecords'),
  getMedicalRecord: (id) => apiCall(api.get, `/web/medicalrecords/${id}`),
  createMedicalRecord: (data) => apiCall(api.post, '/web/medicalrecords', data),
  updateMedicalRecord: (id, data) => apiCall(api.put, `/web/medicalrecords/${id}`, data),
  deleteMedicalRecord: (id) => apiCall(api.delete, `/web/medicalrecords/${id}`),
};

// Product endpoints
const ProductService = {
  getProducts: (page = 0, size = 10) => apiCall(api.get, `/web/products?page=${page}&size=${size}`),
  getProduct: (id) => apiCall(api.get, `/web/products/${id}`),
  getProductsByCategory: (category, page = 0, size = 10) => apiCall(api.get, `/web/products/category/${category}?page=${page}&size=${size}`),
  searchProducts: (query, page = 0, size = 10) => apiCall(api.get, `/web/products/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),
};

// Order endpoints
const OrderService = {
  getOrders: () => apiCall(api.get, '/web/orders'),
  getOrder: (id) => apiCall(api.get, `/web/orders/${id}`),
  createOrder: (data) => apiCall(api.post, '/web/orders', data),
  cancelOrder: (id) => apiCall(api.put, `/web/orders/${id}/cancel`),
  getOrdersByStatus: (status) => apiCall(api.get, `/web/orders/status/${status}`),
};

// Cart endpoints
const CartService = {
  getCart: () => apiCall(api.get, '/web/orders/cart'),
  addToCart: (productId, quantity = 1) => apiCall(api.post, '/web/orders/cart/items', { productId, quantity }),
  updateCartItem: (cartItemId, quantity) => apiCall(api.put, `/web/orders/cart/items/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId) => apiCall(api.delete, `/web/orders/cart/items/${cartItemId}`),
  clearCart: () => apiCall(api.delete, '/web/orders/cart/items'),
};

export {
  api,
  AuthService,
  UserService,
  AppointmentService,
  PrescriptionService,
  MedicalRecordService,
  ProductService,
  OrderService,
  CartService,
}; 