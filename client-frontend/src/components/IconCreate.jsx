import React from 'react';

const IconCreate = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-green-600 transition"
      aria-label="Nuevo Post"
    >
      <i className="fas fa-plus text-xl"></i> 
    </button>
  );
};

export default IconCreate;






