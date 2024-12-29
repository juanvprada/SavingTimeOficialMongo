import React from 'react';
import Carousel from '../components/Carousel';
import { logoImg } from '../utils';


const AboutUs = () => {
  return (
    <div className="bg-[#F5F2ED] text-[#1B3A4B]">
      {/* Header */}
      <header className="bg-[#1B3A4B] py-6">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#F5F2ED] mb-2">
            El arte de saber a dónde volver
          </h2>
          <p className="text-[#E3D5C7] mt-4 text-lg">
            {/* ... your existing text ... */}
          </p>
        </div>
      </header>

      {/* Historia y Misión */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12 relative">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <img 
              src={logoImg} 
              className="w-60 mb-8 transform transition duration-500 ease-in-out hover:scale-110" 
              alt="Logo Bio Blog" 
            />
            <h2 className="text-3xl font-bold text-[#1B3A4B]"></h2>
            <p className="mt-6 text-lg text-[#8A8B6C]">
              {/* ... your existing text ... */}
            </p>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="bg-[#E3D5C7] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1B3A4B] text-center mb-12">
            Conoce a Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">


            {/* Juan - Product Owner */}
            <div className=" bg-gradient-to-br from-green-100 via-orange-50 to-green-100 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out">
              <img src="/src/assets/about-img/provisional.png" alt="Juan" className="w-full h-42 object-cover transition duration-500 grayscale hover:grayscale-0" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700">Juan</h3>
                <p className="text-gray-500 mt-2 text-sm">Product Owner</p>
                <p className="mt-2 text-xs text-gray-600">Define la visión del producto y prioriza las funcionalidades.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

     

      {/* CTA */}
      <section className="bg-[#1B3A4B] py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white animate-pulse">Únete a Nosotros</h2>
          <p className="text-green-200 mt-4 text-lg">Comparte esos lugares a los que merece la pena volver</p>
          <a href="/contacto" className="mt-6 inline-block bg-white text-green-700 font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300 hover:bg-gray-200">
            Contáctanos
          </a>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
