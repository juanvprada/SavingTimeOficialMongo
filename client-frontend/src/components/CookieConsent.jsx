// src/components/CookieConsent.jsx
import React, { useState } from "react";
import { FaCookieBite } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useCookieConsent } from '../contexts/CookieContext';

const CookieConsent = () => {
  const { cookieConsent, updateCookieConsent } = useCookieConsent();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const verifyCookies = () => {
    const allCookies = document.cookie.split(';').reduce((cookies, cookie) => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies[name] = value;
      return cookies;
    }, {});

    console.group('🍪 Estado de Cookies SavingTime');
    console.log('Dominio:', window.location.hostname);
    console.log('Consentimiento guardado:', localStorage.getItem('cookieConsent'));
    console.log('Cookies activas:', allCookies);
    
    // Verificar cookies específicas
    const cookieStatus = {
      analytics: {
        ga: !!allCookies['_ga'],
        gid: !!allCookies['_gid'],
        stAnalytics: !!allCookies['st_analytics']
      },
      marketing: {
        fbp: !!allCookies['_fbp'],
        stMarketing: !!allCookies['st_marketing']
      }
    };
    
    console.log('Estado detallado de cookies:', cookieStatus);
    console.groupEnd();
  };

  // Si ya hay consentimiento, no mostrar el banner
  if (cookieConsent) return null;

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    updateCookieConsent(allConsent);
    setTimeout(verifyCookies, 100); // Verificar después de establecer
  };

  const handleDeclineAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    updateCookieConsent(minimalConsent);
    setTimeout(verifyCookies, 100); // Verificar después de rechazar
  };

  const handleSavePreferences = () => {
    updateCookieConsent(preferences);
    setTimeout(verifyCookies, 100); // Verificar después de guardar preferencias
  };

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-6 flex flex-col md:flex-row justify-between items-center shadow-lg z-50">
      {!showPreferences ? (
        <>
          <div className="flex items-center space-x-4">
            <FaCookieBite className="text-yellow-400 text-4xl" />
            <p>Este sitio utiliza cookies para mejorar su experiencia. Al continuar navegando, aceptas nuestro uso de cookies.</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button 
              onClick={handleAcceptAll} 
              className="bg-green-500 px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300 text-sm"
            >
              Aceptar Todo
            </button>
            <button 
              onClick={() => setShowPreferences(true)} 
              className="bg-yellow-500 px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 text-sm"
            >
              Preferencias
            </button>
            <button 
              onClick={handleDeclineAll} 
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 text-sm"
            >
              Rechazar Todo
            </button>
          </div>
        </>
      ) : (
        <div className="w-full">
          <div className="flex justify-end">
            <AiOutlineClose 
              className="text-2xl cursor-pointer" 
              onClick={() => setShowPreferences(false)} 
            />
          </div>
          <h2 className="text-xl font-bold mb-4">Preferencias de Cookies</h2>
          <p className="mb-4">Seleccione sus preferencias para las cookies:</p>
          <div className="mb-4">
            <input 
              type="checkbox" 
              id="necessary" 
              checked={preferences.necessary}
              disabled 
            />
            <label htmlFor="necessary" className="ml-2">Cookies Necesarias</label>
          </div>
          <div className="mb-4">
            <input 
              type="checkbox" 
              id="analytics"
              checked={preferences.analytics}
              onChange={() => handlePreferenceChange('analytics')}
            />
            <label htmlFor="analytics" className="ml-2">Cookies de Analítica</label>
          </div>
          <div className="mb-4">
            <input 
              type="checkbox" 
              id="marketing"
              checked={preferences.marketing}
              onChange={() => handlePreferenceChange('marketing')}
            />
            <label htmlFor="marketing" className="ml-2">Cookies de Marketing</label>
          </div>
          <button 
            onClick={handleSavePreferences} 
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Guardar Preferencias
          </button>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
