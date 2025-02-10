// services/mapService.js
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
      const coords = await getCoordinates(city);
      const cityArticles = articles.filter(article => article.city === city);
      
      // Crear un array de ubicaciones con offset para cada artículo
      const articleLocations = cityArticles.map((article, index) => {
        if (index === 0 || cityArticles.length === 1) {
          return {
            id: article.id,
            coords: coords,
            article
          };
        }
        
        // Calcular offset en forma de espiral
        const angle = (index * (2 * Math.PI)) / cityArticles.length;
        const radius = 0.002; // Aproximadamente 200 metros
        return {
          id: article.id,
          coords: {
            lat: coords.lat + radius * Math.cos(angle),
            lng: coords.lng + radius * Math.sin(angle)
          },
          article
        };
      });

      return {
        city,
        articles: cityArticles,
        locations: articleLocations
      };
    })
  );
  
  return coordinates.filter(item => item.locations && item.locations.length > 0);
};