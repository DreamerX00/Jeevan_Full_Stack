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
    console.log('Product API Request:', request.method?.toUpperCase(), request.baseURL + request.url);
    return request;
  });
  
  api.interceptors.response.use(
    response => {
      console.log('Product API Response:', response.status, response.config.url);
      return response;
    },
    error => {
      console.error('Product API Error:', error.response?.status, error.config?.url, error.message);
      return Promise.reject(error);
    }
  );
}

// Product service
const productService = {
  // Get all products
  getProducts: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/web/products?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get a specific product by ID
  getProduct: async (id) => {
    try {
      const response = await api.get(`/web/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get products by category
  getProductsByCategory: async (category, page = 0, size = 10) => {
    try {
      const response = await api.get(`/web/products/category/${category}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Search products
  searchProducts: async (query, page = 0, size = 10) => {
    try {
      const response = await api.get(`/web/products/search?query=${query}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products with query ${query}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Add product to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/web/orders/cart/items', { productId, quantity });
      return response.data;
    } catch (error) {
      console.error(`Error adding product ${productId} to cart:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get user's cart
  getCart: async () => {
    try {
      const response = await api.get('/web/orders/cart');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await api.put(`/web/orders/cart/items/${cartItemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error updating cart item ${cartItemId}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/web/orders/cart/items/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error removing item ${cartItemId} from cart:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/web/orders/cart/items');
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Create order from cart
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/web/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get user's orders
  getOrders: async () => {
    try {
      const response = await api.get('/web/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  },
  
  // Get order details
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/web/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error.response?.data || error.message);
      throw error.response?.data || { error: error.message };
    }
  }
};

export default productService; 