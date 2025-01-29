// api.config.js

// Función que obtiene la URL base de la API
export const API_CONFIG = {
  getBaseUrl: () => {
    console.log('Entorno Vite:', import.meta.env);
    console.log('Entorno Window:', window.ENV);

    // Función para limpiar y estandarizar la URL
    const cleanUrl = (url) => {
      if (!url) return 'https://savingtimeoficial.eu-4.evennode.com';
      
      // Eliminar barras finales
      url = url.replace(/\/+$/, '');
      
      // Asegurar HTTPS
      if (!url.startsWith('https://')) {
        url = url.replace('http://', 'https://');
      }

      return url;
    };

    // Si estamos usando Vite
    if (import.meta.env?.VITE_API_URL) {
      const cleanedUrl = cleanUrl(import.meta.env.VITE_API_URL);
      console.log('URL desde Vite:', cleanedUrl);
      return cleanedUrl;
    }

    // Si estamos usando Create React App
    if (window.ENV?.REACT_APP_API_URL) {
      const cleanedUrl = cleanUrl(window.ENV.REACT_APP_API_URL);
      console.log('URL desde Window:', cleanedUrl);
      return cleanedUrl;
    }

    // URL por defecto (producción)
    const defaultUrl = 'https://savingtimeoficial.eu-4.evennode.com';
    console.log('URL por defecto:', defaultUrl);
    return defaultUrl;
  }
};

// Configuración por defecto para axios
export const axiosConfig = {
  headers: {
    'Content-Type': 'application/json'
  },
  // Usar la URL base configurada
  baseURL: API_CONFIG.getBaseUrl()
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