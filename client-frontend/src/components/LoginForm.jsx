import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import useStore from '../store/store';
import axios from 'axios';

// Función para obtener la URL base
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  return window.location.origin;
};

const API_URL = `${getBaseUrl()}/api/auth`;

const LoginForm = ({ inputTextColor, formBackground }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Obtener las funciones del store al inicio del componente
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
    try {
      const response = await axios.post(`https://savingtimeoficial.eu-4.evennode.com//api/auth/login/pepe'`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { data } = response.data;
      console.log('Respuesta del servidor:', data);

      if (data && data.token) {
        setToken(data.token);
        setRole(data.role);
        setUsername(data.name);
        setUserId(data._id || data.userId); 
      
        navigate('/blog');
      } else {
        setError('Respuesta del servidor inválida');
      }
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        // El servidor respondió con un estado de error
        setError(error.response.data?.message || 'Error al iniciar sesión');
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        setError('No se pudo conectar con el servidor');
      } else {
        // Algo ocurrió al configurar la petición
        setError('Error al procesar la solicitud');
      }
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
          />
        </div>
        {error && <p className="text-[#C68B59] text-sm text-center">{error}</p>}
        <button
          className="w-full bg-[#1B3A4B] text-white font-medium py-3 rounded-lg hover:bg-[#8A8B6C] shadow-md transition"
          type="submit"
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <span className={`hover:text-[#C68B59] transition ${inputTextColor}`}>
          ¿Has olvidado tu contraseña?
        </span>{' '}
        <button
          onClick={() => navigate('/recuperar-password')}
          className="text-[#C68B59] hover:text-[#8A8B6C] hover:underline focus:outline-none transition"
        >
          Recuperar contraseña
        </button>
      </p>
    </section>
  );
};

export default LoginForm;
