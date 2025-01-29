import axios from 'axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor simplificado y más robusto
api.interceptors.request.use((config) => {
  try {
    // Asegurar HTTPS en baseURL
    config.baseURL = BASE_URL;
    
    // Limpiar la URL de barras iniciales y dobles
    config.url = config.url.replace(/^\/+/, '').replace(/\/+/g, '/');
    
    // Construir y verificar la URL final
    const finalUrl = new URL(`${config.baseURL}/${config.url}`);
    finalUrl.protocol = 'https:';
    
    // Actualizar configuración
    config.baseURL = `${finalUrl.protocol}//${finalUrl.host}`;
    config.url = finalUrl.pathname + finalUrl.search;
    
    console.log('URL final:', `${config.baseURL}${config.url}`);
    
    return config;
  } catch (error) {
    console.error('Error en interceptor:', error);
    return config;
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en petición:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export default api;