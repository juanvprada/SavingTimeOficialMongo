// src/services/cookieService.js
const COOKIE_CONSENT_KEY = 'cookieConsent';

export const getCookieConsent = () => {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent ? JSON.parse(consent) : null;
};

export const setCookieConsent = (consent) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  
  // Siempre configurar cookies necesarias
  configureCookie('st_necessary', 'true', 365);
  configureCookie('st_session', 'active', 1);
  
  // Configurar otras cookies según preferencias
  Object.entries(consent).forEach(([type, isEnabled]) => {
    if (type === 'necessary') return;
    
    if (isEnabled) {
      switch(type) {
        case 'analytics':
          configureCookie('_ga', 'true', 365);
          configureCookie('_gid', 'true', 1);
          configureCookie('st_analytics', 'true', 365);
          break;
        case 'marketing':
          configureCookie('_fbp', 'true', 90);
          configureCookie('st_marketing', 'true', 365);
          break;
      }
    } else {
      switch(type) {
        case 'analytics':
          removeCookie('_ga');
          removeCookie('_gid');
          removeCookie('st_analytics');
          break;
        case 'marketing':
          removeCookie('_fbp');
          removeCookie('st_marketing');
          break;
      }
    }
  });
};

export const configureCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  const domain = 'savingtimeoficial.eu-4.evennode.com';
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict;domain=${domain};secure`;
};

export const removeCookie = (name) => {
  const domain = 'savingtimeoficial.eu-4.evennode.com';
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain};secure`;
};