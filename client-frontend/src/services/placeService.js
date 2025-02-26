// placeService.js
const FLICKR_API_KEY = 'TU_API_KEY_FLICKR'; // Necesitarás registrarte en Flickr

export const getPlaceDetails = async (coords) => {
  try {
    // 1. Obtener detalles del lugar usando OpenStreetMap
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`;
    const response = await fetch(nominatimUrl, {
      headers: { 'User-Agent': 'SavingTime/1.0' }
    });
    const data = await response.json();

    // 2. Extraer información relevante del lugar
    const placeName = data.name || 
                     data.amenity || 
                     data.shop || 
                     data.leisure || 
                     data.tourism || 
                     data.building ||
                     'Lugar sin nombre';

    // 3. Obtener fotos del lugar usando Flickr
    const photoSearchUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&lat=${coords.lat}&lon=${coords.lng}&radius=0.05&format=json&nojsoncallback=1&per_page=5&sort=relevance`;
    
    const flickrResponse = await fetch(photoSearchUrl);
    const flickrData = await flickrResponse.json();

    // Convertir resultados de Flickr en URLs de imágenes
    const photos = flickrData.photos.photo.map(photo => 
      `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
    );

    return {
      name: placeName,
      city: data.address.city || 
            data.address.town || 
            data.address.village || 
            'Ciudad desconocida',
      type: data.amenity || 
            data.shop || 
            data.leisure || 
            data.tourism || 
            'lugar',
      images: photos,
      address: data.display_name,
      coords: {
        lat: parseFloat(coords.lat),
        lng: parseFloat(coords.lng)
      }
    };
  } catch (error) {
    console.error('Error getting place details:', error);
    throw error;
  }
};