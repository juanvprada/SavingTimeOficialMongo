import React from 'react';

const ButtonIcon = ({ icon, onClick, title, isLiked }) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`text-gray-600 hover:text-gray-900 transition-colors ${isLiked ? 'text-red-600' : 'text-gray-600'}`}
        >
            <i className={icon}></i>
        </button>
    );
};

export default ButtonIcon;

