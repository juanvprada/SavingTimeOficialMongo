// src/services/cookieService.js
const COOKIE_CONSENT_KEY = 'cookieConsent';

export const getCookieConsent = () => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent ? JSON.parse(consent) : null;
};

export const setCookieConsent = (consent) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  
  // Aplicar las preferencias de cookies
  Object.entries(consent).forEach(([type, isEnabled]) => {
    if (type === 'necessary') return; // Las cookies necesarias siempre se mantienen
    
    if (isEnabled) {
      switch(type) {
        case 'analytics':
          // Configurar cookies analíticas
          configureCookie('_ga', 'true', 365);
          configureCookie('_gid', 'true', 1);
          break;
        case 'marketing':
          // Configurar cookies de marketing
          configureCookie('_fbp', 'true', 90);
          break;
      }
    } else {
      switch(type) {
        case 'analytics':
          removeCookie('_ga');
          removeCookie('_gid');
          break;
        case 'marketing':
          removeCookie('_fbp');
          break;
      }
    }
  });
};

export const configureCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

export const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};