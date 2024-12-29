import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const RegisterForm = ({ inputTextColor, formBackground }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const setToken = useStore((state) => state.setToken);
  const setRole = useStore((state) => state.setRole);
  const setUsername = useStore((state) => state.setUsername);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      setMessage('Usuario registrado con éxito.');

      const { data } = response.data;
      setToken(data.token);
      setRole(data.role);
      setUsername(data.name);

      setTimeout(() => {
        navigate('/blog');
      }, 1000);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error al registrar usuario');
    }
  };

  return (
    <section className={`max-w-md mx-auto p-8 rounded-lg shadow-lg mt-2 ${formBackground}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8B6C]" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de usuario"
            className="w-full pl-10 pr-4 py-2 border border-[#8A8B6C] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C68B59] transition bg-transparent text-[#E3D5C7]"
            required
          />
        </div>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8B6C]" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo Electrónico"
            className="w-full pl-10 pr-4 py-2 border border-[#8A8B6C] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C68B59] transition bg-transparent text-[#E3D5C7]"
            required
          />
        </div>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A8B6C]" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full pl-10 pr-4 py-2 border border-[#8A8B6C] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C68B59] transition bg-transparent text-[#E3D5C7]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#1B3A4B] text-white font-medium py-3 rounded-lg hover:bg-[#8A8B6C] shadow-md transition"
        >
          Registrar
        </button>
      </form>
      {message && <p className="text-[#C68B59] text-sm text-center mt-4">{message}</p>}
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

export default RegisterForm;
