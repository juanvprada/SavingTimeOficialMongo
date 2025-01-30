import axios from 'axios';

const API_URL = 'https://savingtimeoficial.eu-4.evennode.com';

console.log('Configuración inicial:', {
  apiUrl: API_URL,
  env: import.meta.env.MODE,
  viteApiUrl: import.meta.env.VITE_API_URL
});

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Forwarded-Proto': 'https'
  }
});

api.interceptors.request.use((config) => {
  const url = new URL(config.url.startsWith('http') ? config.url : `${config.baseURL}/${config.url}`);
  url.protocol = 'https:';
  
  config.baseURL = `${url.origin}/api`;
  config.url = config.url.replace(/^\/+/, '');

  console.log('Request config:', {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    fullUrl: `${config.baseURL}/${config.url}`
  });

  return config;
});

export default api;