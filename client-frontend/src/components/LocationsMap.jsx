// components/LocationsMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCitiesCoordinates } from '../services/mapService';
import L from 'leaflet';

// Crear el icono sin usar require
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

const LocationsMap = ({ articles }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const coords = await getCitiesCoordinates(articles);
        setLocations(coords);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [articles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay ubicaciones disponibles</p>
      </div>
    );
  }

  // Calculate map center (average of all coordinates)
  const center = locations.reduce(
    (acc, loc) => {
      acc.lat += loc.coords.lat / locations.length;
      acc.lng += loc.coords.lng / locations.length;
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker
            key={`${location.city}-${index}`}
            position={[location.coords.lat, location.coords.lng]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-2">{location.city}</h3>
                <ul className="space-y-1">
                  {location.articles.map((article, idx) => (
                    <li key={idx}>
                      <a
                        href={`/post/${article.id}`}
                        className="text-[#1B3A4B] hover:text-[#C68B59]"
                      >
                        {article.name} ({article.kindOfPost})
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationsMap;