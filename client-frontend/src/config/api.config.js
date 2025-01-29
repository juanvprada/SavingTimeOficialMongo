// api.config.js

// Función que obtiene la URL base de la API
export const API_CONFIG = {
  getBaseUrl: () => {
    console.log('Entorno Vite:', import.meta.env);
    console.log('Entorno Window:', window.ENV);
    // Si estamos usando Vite
    if (import.meta.env?.VITE_API_URL) {
      console.log('URL desde Vite:', import.meta.env.VITE_API_URL);
      return import.meta.env.VITE_API_URL;
    }
    // Si estamos usando Create React App
    if (window.ENV?.REACT_APP_API_URL) {
      console.log('URL desde Window:', window.ENV.REACT_APP_API_URL);
      return window.ENV.REACT_APP_API_URL;
    }
    // URL por defecto (desarrollo local)
    console.log('URL por defecto');
    return 'https://savingtimeoficial.eu-4.evennode.com';
  }
};

// Configuración por defecto para axios
export const axiosConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  // Asegurarnos de que las peticiones usen el mismo protocolo que la página
  baseURL: `${window.location.protocol}//${window.location.host}`
};

// Obtener la configuración con el token de autenticación
export const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  };
};

// Helper para obtener la URL completa de las imágenes
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  const baseUrl = API_CONFIG.getBaseUrl();
  // Eliminar posibles barras duplicadas
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  return `${baseUrl}/uploads/${cleanPath}`;
};