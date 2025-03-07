// RecommendationButtons.jsx
import React from 'react';

const RecommendationButtons = ({ value, onChange }) => {
  // Constantes para valores de estado
  const RECOMMENDED = 'Recomendado';
  const DO_NOT_RETURN = 'No volver';
  const NONE = 'Ninguno';

  return (
    <div className="space-y-2">
      <label className="block text-sm text-gray-600">Recomendación</label>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onChange(value === RECOMMENDED ? NONE : RECOMMENDED)}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            value === RECOMMENDED
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
          }`}
        >
          👍 Recomendado
        </button>
        
        <button
          type="button"
          onClick={() => onChange(value === DO_NOT_RETURN ? NONE : DO_NOT_RETURN)}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            value === DO_NOT_RETURN
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
          }`}
        >
          👎 No volver
        </button>
      </div>
      
      {/* Texto que muestra el estado seleccionado actualmente */}
      <div className="text-sm text-center text-gray-500">
        {value === NONE ? 'Sin recomendación seleccionada' : `Estado: ${value}`}
      </div>
    </div>
  );
};

export default RecommendationButtons;