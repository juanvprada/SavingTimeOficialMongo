import React, { useState } from 'react';
import { getPlaceDetails } from '../services/mapService';
import { ThumbsDown } from 'lucide-react';

const NoVolverButton = ({ onSavePost }) => {
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const handleNoVolver = async () => {
    try {
      setLoading(true);
      
      // Obtener ubicación actual
      const coords = await getLocation();
      
      // Obtener detalles del lugar
      const placeInfo = await getPlaceDetails(coords);
      
      if (!placeInfo) {
        throw new Error('No se pudo obtener la información del lugar');
      }
      
      // Crear el post
      const newPost = {
        name: placeInfo.name,
        city: placeInfo.city,
        coordenadas: placeInfo.coords,
        rating: 1,
        price: Math.floor(Math.random() * 4) + 1,
        description: 'No volver',
        kindOfPost: placeInfo.type,
        images: []
      };
      
      // Guardar el post
      await onSavePost(newPost);
      
    } catch (error) {
      console.error('Error al crear post:', error);
      alert('Error al crear el post. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={handleNoVolver}
      className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-colors cursor-pointer"
      title="No volver"
    >
      {loading ? (
        <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent" />
      ) : (
        <ThumbsDown size={24} />
      )}
    </div>
  );
};

export default NoVolverButton;