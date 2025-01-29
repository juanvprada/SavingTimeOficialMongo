import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para asegurar HTTPS
api.interceptors.request.use(
  config => {
    // Forzar HTTPS
    if (config.baseURL.startsWith('http://')) {
      config.baseURL = config.baseURL.replace('http://', 'https://');
    }
    if (config.url.startsWith('http://')) {
      config.url = config.url.replace('http://', 'https://');
    }
    
    // Limpiar dobles slashes
    config.url = config.url.replace(/\/+/g, '/');
    
    console.log('URL final de la petición:', `${config.baseURL}${config.url}`);
    return config;
  },
  error => Promise.reject(error)
);

export default api;