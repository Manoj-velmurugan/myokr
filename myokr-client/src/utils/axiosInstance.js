import axios from 'axios';

// Create an Axios instance with a base URL from environment variable
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  // Optional: use credentials if your backend sets cookies (not needed for JWT)
  // withCredentials: true,
});

// Automatically attach token from localStorage to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
