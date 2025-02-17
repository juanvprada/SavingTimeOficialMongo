const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const getCoordinates = async (city) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(city)}&format=json&limit=1`
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

export const getPlaceDetails = async (coords) => {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`,
      {
        headers: {
          'User-Agent': 'TuAppName/1.0'
        }
      }
    );
    const data = await response.json();

    return {
      name: data.name || data.amenity || data.shop || data.leisure || data.tourism || data.display_name,
      city: data.address.city || data.address.town || data.address.village || 'Ciudad desconocida',
      coords: {
        lat: parseFloat(coords.lat),
        lng: parseFloat(coords.lng)
      },
      type: data.amenity || data.shop || data.leisure || data.tourism || 'lugar'
    };
  } catch (error) {
    console.error('Error getting place details:', error);
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
      
      // Si hay coordenadas específicas en los artículos, usarlas
      const articlesWithCoords = cityArticles.map(article => ({
        ...article,
        coords: article.coordenadas || baseCoords
      }));
      
      return {
        city,
        coords: baseCoords,
        articles: articlesWithCoords
      };
    })
  );
  
  return coordinates.filter(item => item !== null);
};