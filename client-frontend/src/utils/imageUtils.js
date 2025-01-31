export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  console.log('Normalizing image URL:', imageUrl);

  // Si ya es una URL de Cloudinary o una URL completa, retornarla
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Si es una URL antigua (del sistema anterior), usar la URL por defecto
  return 'https://res.cloudinary.com/[TU_CLOUD_NAME]/image/upload/v1/saving-time/default.jpg';
};