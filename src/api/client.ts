import axios from 'axios';

// Use Vite-provided env var if available, otherwise fall back to relative `/api` path
const RAW_API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || undefined;
let baseURL = '/api';
if (RAW_API_BASE && RAW_API_BASE.length > 0) {
  // If user provided a base like `http://localhost:8000`, ensure we point to its root (no trailing /api duplication)
  baseURL = RAW_API_BASE.endsWith('/api') ? RAW_API_BASE : RAW_API_BASE.replace(/\/$/, '') + '/api';
}

export const apiClient = axios.create({
  baseURL, // resolves to e.g. 'http://localhost:8000/api' in prod, or '/api' for dev with proxy
  timeout: 300000000,
});

// Interceptor to add JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or from Zustand
  if (token) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Users APIs
  users: {
    signup: (data: any) => apiClient.post('/users/auth/signup', data),
    login: (data: any) => apiClient.post('/users/auth/login', data),
    onboarding: (data: any) => apiClient.post('/users/me/onboarding', data),
  },

  // Reviews APIs
  reviews: {
    postReview: (data: any) => apiClient.post('/reviews/', data),
  },

  // Recommendations APIs
  recommendations: {
    stream: (data: any) => apiClient.post('/recommendations/stream', data, { responseType: 'stream' }),
    testRecommend: (data: any) => apiClient.post('/recommendations/test', data),
  },

  // Books APIs
  books: {
    createBook: (data: any) => apiClient.post('/books/', data),
  }
};
