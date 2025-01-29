import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

// Función para normalizar la URL y asegurar HTTPS
const normalizeUrl = (url) => {
  return url
    .replace(/^http:\/\//i, 'https://')
    .replace(/([^:]\/)\/+/g, '$1');
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para asegurar HTTPS
api.interceptors.request.use(
  config => {
    // Forzar HTTPS en baseURL y URL completa
    config.baseURL = normalizeUrl(BASE_URL);
    
    // Si la URL es relativa, asegurarse de que no comience con /
    if (!config.url.startsWith('http')) {
      config.url = config.url.replace(/^\/+/, '');
    } else {
      config.url = normalizeUrl(config.url);
    }
    
    // Log para depuración
    const fullUrl = `${config.baseURL}/${config.url}`;
    console.log('URL normalizada:', normalizeUrl(fullUrl));
    
    return {
      ...config,
      url: config.url,
      baseURL: config.baseURL
    };
  },
  error => Promise.reject(error)
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error);
    if (error.config) {
      console.log('URL que falló:', error.config.url);
      console.log('Método:', error.config.method);
    }
    return Promise.reject(error);
  }
);

export default api;