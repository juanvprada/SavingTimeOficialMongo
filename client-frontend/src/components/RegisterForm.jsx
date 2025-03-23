import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_CONFIG } from '../config/api.config';

const RegisterForm = ({ inputTextColor = 'text-gray-700', formBackground = 'bg-white' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUserData } = useStore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_CONFIG.getBaseUrl()}/api/auth/register`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      const { data } = response.data;

      // Usar setUserData con la estructura correcta
      setUserData({
        token: data.token,
        role: data.role,
        name: data.name,
        _id: data.userId  // Nota: cambiado a _id para coincidir con tu store
      });

      setMessage('¡Registro exitoso!');

      // Dar tiempo para que se muestre el mensaje de éxito
      setTimeout(() => {
        navigate('/blog');
      }, 1500);

    } catch (error) {
      console.error('Error detallado:', error.response?.data);

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        'Error en el registro. Por favor, intente nuevamente.';

      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`max-w-md mx-auto p-8 rounded-lg shadow-lg mt-2 ${formBackground}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de usuario"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-transparent text-white placeholder-gray-400"
            required
            disabled={isLoading}
            minLength={2}
            maxLength={100}
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-transparent text-white placeholder-gray-400"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-transparent text-white placeholder-gray-400"
            required
            disabled={isLoading}
            minLength={6}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={togglePasswordVisibility}
            tabIndex="-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white font-medium py-3 rounded-lg transition
            ${isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg'
            }`}
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      {message && (
        <p
          className={`text-sm text-center mt-4 ${message.includes('exitoso') ? 'text-green-600' : 'text-red-600'
            }`}
        >
          {message}
        </p>
      )}

      <p className="mt-6 text-center text-sm">
        <span className={`${inputTextColor}`}>
          ¿Has olvidado tu contraseña?{' '}
        </span>
        <button
          onClick={() => navigate('/recuperar-password')}
          className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none transition"
          disabled={isLoading}
          type="button"
        >
          Recuperar contraseña
        </button>
      </p>
    </section>
  );
};

export default RegisterForm;