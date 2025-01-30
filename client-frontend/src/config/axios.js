import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';
const API_URL = `${BASE_URL}/api`;

// Debug configuration
console.log('API Configuration:', {
  baseUrl: BASE_URL,
  apiUrl: API_URL,
  environment: import.meta.env.MODE
});

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Ensure HTTPS protocol
    const url = new URL(
      config.url.startsWith('http') 
        ? config.url 
        : `${API_URL}/${config.url.replace(/^\/+/, '')}`
    );
    url.protocol = 'https:';

    // Update config
    config.baseURL = `${url.origin}/api`;
    config.url = url.pathname.replace(/^\/api/, '');

    // Debug log
    console.log('Making request:', {
      method: config.method,
      baseURL: config.baseURL,
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default api;