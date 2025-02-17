import React from 'react';

const IconCreate = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition ${className}`}
      aria-label="Nuevo Post"
    >
      <i className="fas fa-plus text-xl"></i> 
    </button>
  );
};

export default IconCreate;






