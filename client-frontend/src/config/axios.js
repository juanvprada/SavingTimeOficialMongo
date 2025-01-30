import axios from 'axios';

// Forzar HTTPS desde el inicio sin depender de variables de entorno
const BASE_URL = new URL('https://savingtimeoficial.eu-4.evennode.com').origin;
const API_URL = `${BASE_URL}/api`;

console.log('Configuración inicial:', {
  baseUrl: BASE_URL,
  apiUrl: API_URL,
  protocol: 'https'
});

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Forwarded-Proto': 'https'
  }
});

// Interceptor simplificado que solo asegura HTTPS
api.interceptors.request.use((config) => {
  // Asegurar que la URL use HTTPS
  const url = new URL(config.url, API_URL);
  url.protocol = 'https:';
  
  config.url = url.pathname;
  
  console.log('Request config:', {
    method: config.method,
    baseURL: config.baseURL,
    url: config.url,
    fullUrl: `${config.baseURL}${config.url}`
  });
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en petición:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;