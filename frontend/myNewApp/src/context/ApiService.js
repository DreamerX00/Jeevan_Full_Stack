import axios from 'axios';

// Create an axios instance with the web-specific API base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api/web', // Updated to use web-specific endpoints
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
  getAppointments: () => api.get('/appointments'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  createAppointment: (data) => api.post('/appointments', data),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

// Prescription endpoints
const PrescriptionService = {
  getPrescriptions: () => api.get('/prescriptions'),
  getPrescription: (id) => api.get(`/prescriptions/${id}`),
  createPrescription: (data) => api.post('/prescriptions', data),
  updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
};

// Medical records endpoints
const MedicalRecordService = {
  getMedicalRecords: () => api.get('/medicalrecords'),
  getMedicalRecord: (id) => api.get(`/medicalrecords/${id}`),
  createMedicalRecord: (data) => api.post('/medicalrecords', data),
  updateMedicalRecord: (id, data) => api.put(`/medicalrecords/${id}`, data),
  deleteMedicalRecord: (id) => api.delete(`/medicalrecords/${id}`),
};

// Product endpoints
const ProductService = {
  getProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  searchProducts: (query) => api.get(`/products/search?query=${query}`),
};

// Order endpoints
const OrderService = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getOrdersByStatus: (status) => api.get(`/orders/status/${status}`),
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
}; 