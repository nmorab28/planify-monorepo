import axios from 'axios';
import { store } from '../store/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337';
const STATIC_API_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;

const getStoredToken = () => {
  try {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    return userDetails?.idToken || userDetails?.jwt || null;
  } catch {
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const reduxToken = state.auth?.auth?.idToken || state.auth?.auth?.jwt;
  const token = reduxToken || getStoredToken() || STATIC_API_TOKEN;

  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
