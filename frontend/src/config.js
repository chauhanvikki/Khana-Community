// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://khana-community.onrender.com';

export const config = {
  apiBaseUrl: API_BASE_URL,
  socketUrl: API_BASE_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

export default config;