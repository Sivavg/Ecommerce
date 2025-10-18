import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const JSON_SERVER_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const googleLogin = (userData) => api.post('/auth/google-login', userData);
export const getCurrentUser = () => api.get('/auth/me');

// Product APIs
export const getProducts = () => axios.get(`${JSON_SERVER_URL}/products`);
export const getProductById = (id) => axios.get(`${JSON_SERVER_URL}/products/${id}`);
export const getCategories = () => axios.get(`${JSON_SERVER_URL}/categories`);

// Cart APIs
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity });
export const updateCartItem = (productId, quantity) => api.put('/cart/update', { productId, quantity });
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);
export const clearCart = () => api.delete('/cart/clear');
export const cleanCart = () => api.post('/cart/clean');

// Wishlist APIs
export const getWishlist = () => api.get('/wishlist');
export const addToWishlist = (productId) => api.post('/wishlist/add', { productId });
export const removeFromWishlist = (productId) => api.delete(`/wishlist/remove/${productId}`);

// Order APIs
export const createOrder = (orderData) => api.post('/orders/create', orderData);
export const getMyOrders = () => api.get('/orders/my-orders');
export const getAllOrders = () => api.get('/orders/all');
export const updateOrderStatus = (orderId, status) => api.put(`/orders/update-status/${orderId}`, { status });

// Address APIs
export const getAddresses = () => api.get('/addresses');
export const addAddress = (addressData) => api.post('/addresses/add', addressData);
export const updateAddress = (id, addressData) => api.put(`/addresses/update/${id}`, addressData);
export const deleteAddress = (id) => api.delete(`/addresses/delete/${id}`);

export default api;
