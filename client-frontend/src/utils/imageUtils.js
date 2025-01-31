export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  console.log('Normalizing image URL:', imageUrl);

  // Si ya es una URL completa
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // URL por defecto si no hay imagen
  return 'https://res.cloudinary.com/dj4mtygcr/image/upload/v1738324021/default_ohqt2c.jpg';
};