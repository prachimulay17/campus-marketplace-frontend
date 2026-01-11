import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth headers if needed (though we're using cookies)
api.interceptors.request.use(
  (config) => {
    // You can add additional headers here if needed
    // For now, we're relying on cookies for authentication
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        // Don't automatically redirect - let components handle authentication
        return Promise.reject(new Error('Authentication required'));
      }

      // Handle validation errors
      if (status === 400 && data && typeof data === 'object' && 'message' in data) {
        return Promise.reject(new Error(data.message as string));
      }

      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }

      // Handle other API errors with message from backend
      if (data && typeof data === 'object' && 'message' in data) {
        return Promise.reject(new Error(data.message as string));
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR') {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }

    // Generic error
    return Promise.reject(new Error('Something went wrong. Please try again.'));
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    register: '/users/register',
    login: '/users/login',
    logout: '/users/logout',
    refreshToken: '/users/refresh-token',
    me: '/users/me',
    updateProfile: '/users/profile',
    changePassword: '/users/change-password',
  },

  // Item endpoints
  items: {
    list: '/items',
    create: '/items',
    getById: (id: string) => `/items/${id}`,
    update: (id: string) => `/items/${id}`,
    delete: (id: string) => `/items/${id}`,
    markAsSold: (id: string) => `/items/${id}/sold`,
    getBySeller: (sellerId: string) => `/items/seller/${sellerId}`,
    getMyItems: '/items/user/my-items',
  },

  // Upload endpoints
  upload: {
    images: '/upload/images',
  },
};

// Helper function to create FormData for file uploads
export const createFormData = (files: File[]): FormData => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('images', file);
  });
  return formData;
};

export default api;
