// utils/imageUtils.js
export const normalizeImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Remove any duplicate '/uploads'
    const cleanPath = imageUrl.replace(/\/uploads\/+/g, '/uploads/');
    
    const baseUrl = 'https://savingtimeoficial.eu-4.evennode.com';
    return `${baseUrl}${cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`}`;
  };