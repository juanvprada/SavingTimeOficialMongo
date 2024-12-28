import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import useStore from '../store/store';
import axios from 'axios';

const LoginForm = ({ inputTextColor, formBackground }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const setToken = useStore((state) => state.setToken);
  const setRole = useStore((state) => state.setRole);
  const setUsername = useStore((state) => state.setUsername);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/acceso', { email, password });
      const { token, role, name } = response.data;

      if (token) {
        setToken(token);
        setRole(role);
        setUsername(name);
        navigate('/blog');
      } else {
        setError('Correo electrónico o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se recibió respuesta del servidor.');
    }
  };

  return (
    <section className={`max-w-md mx-auto p-8 rounded-lg shadow-lg ${formBackground}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            required
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 shadow-md transition"
          type="submit"
        >
          Iniciar Sesión
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <span className={`hover:text-green-500 transition ${inputTextColor}`}>
          ¿Has olvidado tu contraseña?
        </span>{' '}
        <button
          onClick={() => navigate('/recuperar-password')}
          className="text-green-600 hover:underline focus:outline-none"
        >
          Recuperar contraseña
        </button>
      </p>
    </section>
  );
};

export default LoginForm;
