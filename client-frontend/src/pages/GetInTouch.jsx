import React, { useState } from "react";
import ContactForm from "../components/ContactForm";

const GetInTouch = () => {
  const [submittedMessages, setSubmittedMessages] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F2ED] to-[#E3D5C7]/30 py-12 sm:py-16">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C68B59]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8A8B6C]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#1B3A4B]/5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Encabezado mejorado */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-[#1B3A4B] mb-4 font-playfair relative inline-block">
            Contáctanos
            <span className="block h-1 w-24 bg-[#C68B59] mx-auto mt-3"></span>
          </h1>
          <p className="text-[#8A8B6C] max-w-xl mx-auto mt-4 text-base sm:text-lg font-montserrat">
            Estamos aquí para responder tus preguntas y ayudarte a descubrir experiencias de viaje auténticas.
          </p>
        </div>
        
        {/* Contenedor principal con información adicional */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#1B3A4B] hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#1B3A4B]/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1B3A4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1B3A4B] mb-2">Email</h3>
              <p className="text-[#8A8B6C]">info@savingtime.com</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#C68B59] hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#C68B59]/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C68B59]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1B3A4B] mb-2">Teléfono</h3>
              <p className="text-[#8A8B6C]">+34 123 456 789</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#8A8B6C] hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-[#8A8B6C]/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8A8B6C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1B3A4B] mb-2">Ubicación</h3>
              <p className="text-[#8A8B6C]">Madrid, España</p>
            </div>
          </div>
          
          {/* Formulario de contacto */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C68B59]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8A8B6C]/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>
              
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1B3A4B] mb-6 relative z-10">Envíanos un mensaje</h2>
              <div className="relative z-10">
                <ContactForm
                  submittedMessages={submittedMessages}
                  setSubmittedMessages={setSubmittedMessages}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ o información adicional (opcional) */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#1B3A4B] mb-4">Preguntas Frecuentes</h3>
          <p className="text-[#8A8B6C] mb-6">Encuentra respuestas a las preguntas más comunes sobre nuestros servicios y cómo podemos ayudarte a descubrir lugares únicos.</p>
          <a href="/faq" className="inline-block bg-[#1B3A4B] text-white py-2 px-6 rounded-lg transition-colors duration-300 hover:bg-[#C68B59]">
            Ver FAQ
          </a>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;