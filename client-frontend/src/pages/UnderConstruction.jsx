import React, { useState, useEffect } from 'react';
import { construccionImg } from '../utils';
import { Link } from 'react-router-dom';

const UnderConstruction = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const difference = +new Date('2025-01-01') - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }
    timerComponents.push(
      <span key={interval} className="text-lg font-semibold text-gray-700">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center p-10 bg-white rounded-xl shadow-lg transform transition-all hover:scale-105">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">¡Estamos Trabajando en Algo Genial!</h1>
        <p className="text-lg text-gray-700 mb-8">Nuestro sitio estará disponible pronto. Mientras tanto, visita nuestras otras páginas.</p>
        {timerComponents.length ? timerComponents : <span>¡Ya casi estamos listos!</span>}
        <img src={construccionImg} alt="En construcción" className="mx-auto mb-8 w-full max-w-md mt-6" />
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link to="/home" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300">Inicio</Link>
          <Link to="/about" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300">Sobre Nosotros</Link>
          <Link to="/contact" className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition duration-300">Contacto</Link>
        </div>
        <div className="text-2xl font-semibold text-gray-800 mb-4">
          
        </div>
        <div>
          <Link to="/contacto" className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300 no-underline">Contáctanos</Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
