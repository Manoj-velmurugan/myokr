import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Keep this if using cookies (optional)
});

// Add Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // stored during login

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
