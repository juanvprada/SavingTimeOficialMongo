import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim() === '') {
      alert('Please enter a search query.');
      return;
    }
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-md mx-auto">
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          type="text"
          placeholder="Busca aquí"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full h-12 pl-10 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="h-12 px-4 bg-green-500 text-white rounded-r-md hover:bg-green-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default Search;


