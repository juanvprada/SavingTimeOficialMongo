export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  console.log('Normalizing image URL:', imageUrl); // Debug

  // Si ya es una URL completa, retornarla
  if (imageUrl.startsWith('http')) {
    console.log('URL completa detectada:', imageUrl);
    return imageUrl;
  }

  const baseUrl = 'https://savingtimeoficial.eu-4.evennode.com';
  const fullUrl = imageUrl.startsWith('/') 
    ? `${baseUrl}${imageUrl}`
    : `${baseUrl}/uploads/${imageUrl}`;

  console.log('URL normalizada:', fullUrl); // Debug
  return fullUrl;
};