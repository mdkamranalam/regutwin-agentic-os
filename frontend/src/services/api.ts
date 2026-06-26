import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 min timeout for heavier AI tasks
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle connection issues gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network Error
      console.error('Network/Server Error: Could not connect to the Backend or AI Bridge.', error);
      window.dispatchEvent(new CustomEvent('api-connection-error', { 
        detail: { message: 'Backend unreachable. Please ensure Docker services are running.' } 
      }));
    } else if (error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    } else if (error.response.status >= 500) {
      console.error('Server Error:', error.response.data);
      window.dispatchEvent(new CustomEvent('api-connection-error', { 
        detail: { message: 'AI Bridge or Backend returned a 500+ error. Check server logs.' } 
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
