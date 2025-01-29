import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para forzar HTTPS y normalizar URLs
api.interceptors.request.use(
  config => {
    // Construir una URL completa para manipular
    const urlObject = new URL(
      config.url.startsWith('http') ? config.url : `${config.baseURL}/${config.url}`
    );
    
    // Forzar HTTPS
    urlObject.protocol = 'https:';
    
    // Asignar las partes normalizadas de vuelta a la configuración
    config.baseURL = `${urlObject.protocol}//${urlObject.host}`;
    config.url = urlObject.pathname + urlObject.search;

    console.log('URL final:', `${config.baseURL}${config.url}`);
    
    return config;
  },
  error => {
    console.error('Error en la configuración:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Utilidades de API
export const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('https://')) return imagePath;
  return `${BASE_URL}/uploads/${imagePath.replace(/^\/+/, '')}`;
};

export default api;