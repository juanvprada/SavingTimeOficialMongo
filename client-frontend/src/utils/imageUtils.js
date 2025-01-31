export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  console.log('Normalizing image URL:', imageUrl);

  // Si ya es una URL de Cloudinary
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // Si es una URL antigua de evennode
  if (imageUrl.includes('evennode.com')) {
    // Extraer el nombre del archivo
    const fileName = imageUrl.split('/').pop();
    // Construir la nueva URL de Cloudinary
    return `https://res.cloudinary.com/dj4mtygcr/image/upload/v1738324021/${fileName}`;
  }

  // Si es solo un nombre de archivo
  return `https://res.cloudinary.com/dj4mtygcr/image/upload/v1738324021/${imageUrl}`;
};