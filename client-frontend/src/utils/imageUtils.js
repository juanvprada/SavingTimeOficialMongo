// utils/imageUtils.js
export const normalizeUrl = (path) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://savingtimeoficial.eu-4.evennode.com';
  
  const url = baseUrl.startsWith('http') 
    ? baseUrl.replace('http://', 'https://') 
    : `https://${baseUrl}`;
  
  if (!path) return url;
  
  return path.startsWith('/')
    ? `${url}${path}`
    : `${url}/${path}`;
};

// Alias para mantener compatibilidad con importaciones existentes
export const normalizeImageUrl = normalizeUrl;

// Función específica para manejar URLs de imágenes
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Si ya es una URL completa, devolverla tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Eliminar barras duplicadas y asegurar formato correcto
  const cleanPath = imagePath.replace(/^\/+/, '');
  
  return normalizeUrl(`/uploads/${cleanPath}`);
};