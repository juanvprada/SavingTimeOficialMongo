export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  console.log('Normalizing image URL:', imageUrl);

  // Si ya es una URL de Cloudinary, devolverla tal cual
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  // Si el nombre de la imagen es solo el archivo, agregar la carpeta
  return `https://res.cloudinary.com/dj4mtygcr/image/upload/saving-time/${imageUrl}`;
};
