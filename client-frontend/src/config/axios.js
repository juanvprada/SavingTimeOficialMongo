import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://savingtimeoficial.eu-4.evennode.com';

console.log('Base URL configurada:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de peticiones
api.interceptors.request.use(
  (config) => {
    console.log('Enviando petición:', {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Error en respuesta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export default api;