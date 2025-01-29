import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import useStore from '../store/store';
import axios from 'axios';

// Crear instancia configurada de axios con interceptores
const api = axios.create({
  baseURL: 'https://savingtimeoficial.eu-4.evennode.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Añadir interceptores para depuración y forzar HTTPS
api.interceptors.request.use(
  config => {
    // Forzar HTTPS
    if (config.baseURL.startsWith('http://')) {
      config.baseURL = config.baseURL.replace('http://', 'https://');
    }
    
    // Asegurarse de que no haya dobles barras y la URL use HTTPS
    config.url = config.url.replace(/\/+/g, '/');
    const fullUrl = `${config.baseURL}${config.url}`;
    
    // Verificar que la URL final use HTTPS
    if (!fullUrl.startsWith('https://')) {
      config.baseURL = config.baseURL.replace('http://', 'https://');
    }
    
    console.log('URL final de la petición:', fullUrl);
    return config;
  },
  error => {
    console.error('Error en la configuración de la petición:', error);
    return Promise.reject(error);
  }
);

const LoginForm = ({ inputTextColor, formBackground }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setToken = useStore((state) => state.setToken);
  const setRole = useStore((state) => state.setRole);
  const setUsername = useStore((state) => state.setUsername);
  const setUserId = useStore((state) => state.setUserId);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setLoading(true);
    setError('');
  
    try {
      const response = await api.post('api/auth/login', {
        email,
        password
      });
  
      const { data } = response.data;
      console.log('Respuesta del servidor:', response);
      
      if (data?.token) {
        setToken(data.token);
        setRole(data.role);
        setUsername(data.name);
        setUserId(data._id || data.userId);
        navigate('/blog');
      } else {
        throw new Error('Respuesta del servidor inválida');
      }
    } catch (error) {
      console.error('Error completo:', error);
      setError(
        error.response?.data?.message || 
        'No se pudo conectar con el servidor. Por favor, intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`max-w-md mx-auto p-8 rounded-lg shadow-lg ${formBackground}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8B6C]" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-[#8A8B6C] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C68B59] transition bg-transparent text-[#E3D5C7]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
            disabled={loading}
            autoComplete="email"
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8B6C]" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-[#8A8B6C] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C68B59] transition bg-transparent text-[#E3D5C7]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p className="text-[#C68B59] text-sm text-center bg-[#1B3A4B] bg-opacity-20 p-2 rounded">
            {error}
          </p>
        )}
        <button
          className={`w-full bg-[#1B3A4B] text-white font-medium py-3 rounded-lg hover:bg-[#8A8B6C] shadow-md transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <span className={`hover:text-[#C68B59] transition ${inputTextColor}`}>
          ¿Has olvidado tu contraseña?
        </span>{' '}
        <button
          onClick={() => navigate('/recuperar-password')}
          className="text-[#C68B59] hover:text-[#8A8B6C] hover:underline focus:outline-none transition"
          disabled={loading}
        >
          Recuperar contraseña
        </button>
      </p>
    </section>
  );
};

export default LoginForm;
