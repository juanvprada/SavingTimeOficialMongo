import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import useStore from '../store/store';
import api from '../config/axios';  // Importar el cliente api configurado

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
    
    try {
      console.log('Iniciando petición de login a:', 'auth/login');
      
      const response = await api.post('auth/login', {
        email: email.trim().toLowerCase(),
        password
      });
  
      console.log('Respuesta exitosa:', response.data);
      
      if (response.data?.data?.token) {
        setToken(response.data.data.token);
        setRole(response.data.data.role);
        setUsername(response.data.data.name);
        setUserId(response.data.data.userId);
        navigate('/blog');
      } else {
        console.error('Respuesta sin token:', response.data);
        setError('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error detallado:', {
        message: error.message,
        config: error.config,
        response: error.response
      });
      
      setError(error.response?.data?.message || 'Error de conexión');
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
