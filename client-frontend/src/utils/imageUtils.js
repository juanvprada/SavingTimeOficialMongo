// utils/imageUtils.js
export const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Remove any duplicate '/uploads'
    const cleanPath = imageUrl.replace(/\/uploads\/+/g, '/uploads/');
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  };