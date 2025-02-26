import React, { useState } from 'react';
import { ThumbsDown } from 'lucide-react';
import { getPlaceDetails } from '../services/placeService';
import { toast } from 'react-toastify';

const NoVolverButton = ({ onSavePost }) => {
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error('Tu navegador no soporta geolocalización');
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          toast.error('Error al obtener la ubicación. Por favor, permite el acceso a la ubicación.');
          reject(error);
        }
      );
    });
  };

  const handleNoVolver = async () => {
    try {
      setLoading(true);
      toast.info('Obteniendo ubicación...');
      
      // 1. Obtener ubicación actual
      const coords = await getLocation();
      
      // 2. Obtener detalles del lugar y fotos
      toast.info('Obteniendo información del lugar...');
      const placeInfo = await getPlaceDetails(coords);
      
      // 3. Crear el post
      const newPost = {
        name: placeInfo.name,
        city: placeInfo.city,
        coordenadas: placeInfo.coords,
        rating: 1,
        price: Math.floor(Math.random() * 4) + 1,
        description: `No volver - ${placeInfo.address}`,
        kindOfPost: placeInfo.type,
        images: placeInfo.images
      };
      
      // 4. Guardar el post
      await onSavePost(newPost);
      toast.success('Lugar marcado como "No volver"');
      
    } catch (error) {
      console.error('Error al crear post:', error);
      toast.error('Error al crear el post. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleNoVolver}
      disabled={loading}
      className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="No Volver"
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent" />
      ) : (
        <ThumbsDown size={20} />
      )}
    </button>
  );
};

export default NoVolverButton;