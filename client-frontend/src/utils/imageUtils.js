export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  console.log('Normalizing image URL:', imageUrl);

  // Si ya es una URL de Cloudinary, retornarla (corregida)
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.replace('hhttps://', 'https://');
  }

  // Si es una URL antigua, convertirla a la nueva URL de Cloudinary
  if (imageUrl.includes('savingtimeoficial.eu-4.evennode.com')) {
    return 'https://res.cloudinary.com/dj4mtygcr/image/upload/v1738324021/default_ohqt2c.jpg';
  }

  // Si es solo un nombre de archivo, construir la URL de Cloudinary
  return `https://res.cloudinary.com/dj4mtygcr/image/upload/${imageUrl}`;
};