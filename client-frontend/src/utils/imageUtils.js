export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // Solo devolver la URL tal cual - no intentar modificarla
  return imageUrl;
};