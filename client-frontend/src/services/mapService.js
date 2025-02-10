const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export const getCoordinates = async (city) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(city)}&format=json&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
};

export const getCitiesCoordinates = async (articles) => {
  const uniqueCities = [...new Set(articles.map(article => article.city))];
  const coordinates = await Promise.all(
    uniqueCities.map(async (city) => {
      const baseCoords = await getCoordinates(city);
      if (!baseCoords) return null;

      const cityArticles = articles.filter(article => article.city === city);
      
      // Calcular offset para la ciudad si tiene múltiples artículos
      if (cityArticles.length > 1) {
        const radius = 0.002; // Aproximadamente 200 metros
        const angle = (2 * Math.PI) / cityArticles.length;
        
        return {
          city,
          coords: {
            lat: baseCoords.lat + radius * Math.cos(angle),
            lng: baseCoords.lng + radius * Math.sin(angle)
          },
          articles: cityArticles
        };
      }

      // Si solo hay un artículo, usar las coordenadas base
      return {
        city,
        coords: baseCoords,
        articles: cityArticles
      };
    })
  );
  
  return coordinates.filter(item => item !== null);
};