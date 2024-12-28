import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/recover-password', {
                email,
            });
            setMessage(response.data.message);
            setEmail('');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Error al enviar la solicitud de recuperación');
            } else {
                setError('Error en la solicitud: ' + err.message);
            }
        }
    };

    return (
        <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-24 mb-24 relative z-10">
            <h2 className="text-2xl font-semibold text-center text-green-600">Recuperar Contraseña</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label className="block text-gray-700" htmlFor="email">Correo Electrónico</label>
                    <input
                    className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring focus:ring-green-200"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce tu correo electrónico"
                    required />
                </div>
                <button className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition" type="submit">
                    Enviar enlace de recuperación
                </button>
            </form>
        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <p className="mt-4 text-center">
        <span className="text-gray-600">¿Ya tienes tu contraseña?</span>{' '}
        <button
            onClick={() => navigate('/acceso')}
            className="text-green-600 hover:underline focus:outline-none">
            {/* texto del botón */}
        </button>
    </p>
</section>

    );
};

export default RecoverPassword;
