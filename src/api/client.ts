import axios from 'axios';

// Mock API Client for demonstration
export const apiClient = axios.create({
  baseURL: '/api', // In a real app, this would be your FastAPI URL
  timeout: 10000,
});

// Interceptor to add JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
