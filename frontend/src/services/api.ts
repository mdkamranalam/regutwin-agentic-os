import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s timeout for heavier AI tasks
});

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
