import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

// Debug de la URL base
console.log('Configuración inicial de axios:', {
  baseUrl: BASE_URL,
  fullApiUrl: `${BASE_URL}/api`
});

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para garantizar HTTPS
api.interceptors.request.use((config) => {
  // Forzar HTTPS en la URL
  const urlString = `${config.baseURL}/${config.url}`.replace(/([^:]\/)\/+/g, '$1');
  const url = new URL(urlString);
  url.protocol = 'https:';
  
  // Actualizar la configuración
  config.baseURL = url.origin;
  config.url = url.pathname + url.search;

  console.log('Request final:', {
    method: config.method,
    baseURL: config.baseURL,
    url: config.url,
    fullUrl: `${config.baseURL}${config.url}`,
    headers: config.headers
  });

  return config;
});

export default api;