import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1337/api',
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.auth?.idToken;

  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
