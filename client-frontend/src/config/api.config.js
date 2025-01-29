// api.config.js
const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

export const API_CONFIG = {
  getBaseUrl: () => BASE_URL
};

export const axiosConfig = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  };
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('https')) return imagePath;
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${BASE_URL}/uploads/${cleanPath}`;
};