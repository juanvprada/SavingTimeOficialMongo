// utils/imageUtils.js
const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com';

export const normalizeUrl = (path) => {
  if (!path) return BASE_URL;
  const cleanPath = path.replace(/^\/+/, '');
  return `${BASE_URL}/${cleanPath}`;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `${BASE_URL}/uploads/${cleanPath}`;
};

export default {
  normalizeUrl,
  getImageUrl
};