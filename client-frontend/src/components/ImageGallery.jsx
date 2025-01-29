// components/ImageGallery.jsx
import React, { useState } from 'react';
import { normalizeUrl } from '../utils/imageUtils';

const ImageGallery = ({ images, postName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState({});

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http')) return imageUrl;
    
    if (imageUrl.startsWith('/uploads')) {
      return normalizeUrl(imageUrl);
    }
    
    if (!imageUrl.startsWith('/uploads/')) {
      return normalizeUrl(`/uploads/${imageUrl}`);
    }
    
    return normalizeUrl(imageUrl);
  };
  console.log('Received images:', images); // Para debug

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <i className="fas fa-image text-gray-400 text-4xl mb-2"></i>
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      </div>
    );
  }

  // Para debug - imprimir las URLs procesadas
  images.forEach((img, index) => {
    console.log(`Image ${index} URL:`, getImageUrl(img));
  });

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative w-full h-96">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`${postName} - Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            console.log('Error loading image:', images[currentIndex]); // Para debug
            setImageError(prev => ({ ...prev, [images[currentIndex]]: true }));
            e.target.src = 'http://localhost:5000/uploads/default.jpg';
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={() => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-lg 
                ${index === currentIndex ? 'ring-2 ring-[#1B3A4B]' : 'ring-1 ring-gray-200'}
              `}
            >
              <img
                src={getImageUrl(image)}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('Error loading thumbnail:', image); // Para debug
                  e.target.src = 'http://localhost:5000/uploads/default.jpg';
                }}
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-[#1B3A4B] bg-opacity-20"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;