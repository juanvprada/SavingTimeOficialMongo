import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

console.log('API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: `${BASE_URL}/api`,  // Añadimos /api explícitamente
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para debug y limpieza de URLs
api.interceptors.request.use((config) => {
  // Remover barras iniciales duplicadas
  config.url = config.url.replace(/^\/+/, '');
  
  const fullUrl = `${config.baseURL}/${config.url}`;
  
  console.log('Request:', {
    method: config.method,
    url: fullUrl,
    headers: config.headers,
    data: config.data
  });
  
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Interceptor de respuestas para debug
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    return Promise.reject(error);
  }
);

export default api;