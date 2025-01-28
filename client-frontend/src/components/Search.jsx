import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Search = ({ onSearch, postTypes }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    kindOfPost: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: '',
    description: ''
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
    setIsAdvancedOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      kindOfPost: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxRating: '',
      description: ''
    });
    onSearch({});
    setIsAdvancedOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 px-4">
      <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-md transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Barra de búsqueda principal con diseño refinado */}
          <div className="relative flex items-center p-2">
            <div className="relative flex-1 group">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 group-hover:text-[#1B3A4B] transition-colors">
                <FontAwesomeIcon icon={faSearch} className="text-base" />
              </span>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all duration-300 text-base placeholder-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="ml-3 px-4 py-2.5 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#8A8B6C] transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <FontAwesomeIcon icon={faFilter} className="text-sm" />
              <span className="hidden sm:inline text-sm">Filtros</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`transition-transform duration-300 text-sm ${isAdvancedOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Panel de filtros avanzados con animación */}
          <div className={`overflow-hidden transition-all duration-300 ${isAdvancedOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-3 pt-0 space-y-4 bg-gray-50 rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Tipo de Post */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Tipo de lugar
                  </label>
                  <select
                    value={filters.kindOfPost}
                    onChange={(e) => handleInputChange('kindOfPost', e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                  >
                    <option value="">Todos los tipos</option>
                    {postTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Ciudad */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="¿Dónde buscas?"
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                  />
                </div>

                {/* Rango de Precios */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Rango de precios
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      placeholder="Min €"
                      min="0"
                      className="w-1/2 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      placeholder="Max €"
                      min="0"
                      className="w-1/2 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Puntuación */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-600">
                    Puntuación
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minRating}
                      onChange={(e) => handleInputChange('minRating', e.target.value)}
                      placeholder="Min ★"
                      min="1"
                      max="5"
                      className="w-1/2 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                    />
                    <input
                      type="number"
                      value={filters.maxRating}
                      onChange={(e) => handleInputChange('maxRating', e.target.value)}
                      placeholder="Max ★"
                      min="1"
                      max="5"
                      className="w-1/2 p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-600">
                  Palabras clave en la descripción
                </label>
                <input
                  type="text"
                  value={filters.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Buscar palabras específicas en las descripciones..."
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B3A4B] transition-all text-sm"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1.5 text-sm"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#8A8B6C] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 text-sm"
                >
                  <FontAwesomeIcon icon={faSearch} className="text-xs" />
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Indicador de filtros activos */}
      {Object.values(filters).some(value => value !== '') && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Object.entries(filters).map(([key, value]) => {
            if (value) {
              return (
                <span key={key} className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#1B3A4B] text-white text-xs">
                  {key === 'kindOfPost' ? 'Tipo' : 
                   key === 'minPrice' ? 'Desde' :
                   key === 'maxPrice' ? 'Hasta' :
                   key === 'minRating' ? 'Min ★' :
                   key === 'maxRating' ? 'Max ★' :
                   key}: {value}
                  <button
                    onClick={() => handleInputChange(key, '')}
                    className="ml-1.5 hover:text-red-300"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xs" />
                  </button>
                </span>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default Search;

