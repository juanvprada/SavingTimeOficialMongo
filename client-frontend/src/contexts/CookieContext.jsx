// src/contexts/CookieContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getCookieConsent, setCookieConsent } from '../services/cookieService';

const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const [cookieConsent, setCookieConsentState] = useState(null);

  useEffect(() => {
    const savedConsent = getCookieConsent();
    if (savedConsent) {
      setCookieConsentState(savedConsent);
    }
  }, []);

  const updateCookieConsent = (newConsent) => {
    setCookieConsent(newConsent);
    setCookieConsentState(newConsent);
  };

  return (
    <CookieContext.Provider value={{ cookieConsent, updateCookieConsent }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieConsent = () => useContext(CookieContext);