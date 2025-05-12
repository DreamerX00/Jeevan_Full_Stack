import axios from 'axios';

// Create an axios instance with the API base URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
      // Redirect to login page or refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User profile endpoints
const UserService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
};

// Appointment endpoints
const AppointmentService = {
  getAppointments: () => api.get('/web/appointments'),
  getAppointment: (id) => api.get(`/web/appointments/${id}`),
  createAppointment: (data) => api.post('/web/appointments', data),
  updateAppointment: (id, data) => api.put(`/web/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/web/appointments/${id}`),
};

// Prescription endpoints
const PrescriptionService = {
  getPrescriptions: () => api.get('/web/prescriptions'),
  getPrescription: (id) => api.get(`/web/prescriptions/${id}`),
  createPrescription: (data) => api.post('/web/prescriptions', data),
  updatePrescription: (id, data) => api.put(`/web/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/web/prescriptions/${id}`),
};

// Medical records endpoints
const MedicalRecordService = {
  getMedicalRecords: () => api.get('/web/medicalrecords'),
  getMedicalRecord: (id) => api.get(`/web/medicalrecords/${id}`),
  createMedicalRecord: (data) => api.post('/web/medicalrecords', data),
  updateMedicalRecord: (id, data) => api.put(`/web/medicalrecords/${id}`, data),
  deleteMedicalRecord: (id) => api.delete(`/web/medicalrecords/${id}`),
};

// Product endpoints
const ProductService = {
  getProducts: (page = 0, size = 10) => api.get(`/web/products?page=${page}&size=${size}`),
  getProduct: (id) => api.get(`/web/products/${id}`),
  getProductsByCategory: (category, page = 0, size = 10) => api.get(`/web/products/category/${category}?page=${page}&size=${size}`),
  searchProducts: (query, page = 0, size = 10) => api.get(`/web/products/search?query=${query}&page=${page}&size=${size}`),
};

// Order endpoints
const OrderService = {
  getOrders: () => api.get('/web/orders'),
  getOrder: (id) => api.get(`/web/orders/${id}`),
  createOrder: (data) => api.post('/web/orders', data),
  cancelOrder: (id) => api.put(`/web/orders/${id}/cancel`),
  getOrdersByStatus: (status) => api.get(`/web/orders/status/${status}`),
};

// Cart endpoints
const CartService = {
  getCart: () => api.get('/web/orders/cart'),
  addToCart: (productId, quantity = 1) => api.post('/web/orders/cart/items', { productId, quantity }),
  updateCartItem: (cartItemId, quantity) => api.put(`/web/orders/cart/items/${cartItemId}`, { quantity }),
  removeFromCart: (cartItemId) => api.delete(`/web/orders/cart/items/${cartItemId}`),
  clearCart: () => api.delete('/web/orders/cart/items'),
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