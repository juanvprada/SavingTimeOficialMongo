// utils/imageUtils.js
export const normalizeUrl = (path) => {
  // Log de depuración de entorno
  console.log('Entorno completo:', import.meta.env);
  
  // Obtener URL base, con múltiples fuentes de respaldo
  const baseUrl = 
    import.meta.env.VITE_API_URL || 
    window.ENV?.API_URL || 
    'https://savingtimeoficial.eu-4.evennode.com';
  
  console.log('URL base detectada:', baseUrl);

  // Asegurar protocolo HTTPS
  const url = baseUrl.startsWith('http') 
    ? baseUrl.replace('http://', 'https://') 
    : `https://${baseUrl.replace(/^\/+/, '')}`;
  
  // Si no hay path, devolver solo la URL base
  if (!path) return url;

  // Limpiar el path para evitar barras duplicadas
  const cleanPath = path.replace(/^\/+/, '');
  
  // Construir URL completa
  const fullUrl = `${url.replace(/\/+$/, '')}/${cleanPath}`;
  
  console.log('URL final:', fullUrl);
  
  return fullUrl;
};

// Alias para mantener compatibilidad
export const normalizeImageUrl = normalizeUrl;

// Función específica para manejar URLs de imágenes
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa, devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Limpiar path de imágenes
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  return normalizeUrl(`/uploads/${cleanPath}`);
};

// Exportación por defecto para mayor compatibilidad
export default {
  normalizeUrl,
  normalizeImageUrl,
  getImageUrl
};