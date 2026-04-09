import axios from 'axios';

const customFetch = axios.create({
  baseURL: '/api/v1',
});

// Request interceptor - add token to Authorization header
customFetch.interceptors.request.use(
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

// Response interceptor - handle 401 (Unauthorized)
customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data
      window.location.href = '/login';
      localStorage.removeItem('user');
      // Redirect to login/register page
      window.location.href = '/register';
    }
    return Promise.reject(error);
  }
);

export default customFetch;
