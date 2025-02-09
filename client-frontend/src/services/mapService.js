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
      return {
        city,
        coords,
        articles: articles.filter(article => article.city === city)
      };
    })
  );
  
  return coordinates.filter(item => item.coords !== null);
};