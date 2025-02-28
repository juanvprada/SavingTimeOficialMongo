import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = useStore((state) => state.token);
    const username = useStore((state) => state.username);
    const role = useStore((state) => state.role);
    const userId = useStore((state) => state.userId);
    const clearStore = useStore((state) => state.clearStore);

    useEffect(() => {
        if (!token) {
            navigate('/acceso');
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://savingtimeoficial.eu-4.evennode.com/api/auth/perfil', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setUser(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Error al conectar con el servidor');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, navigate]);

    const handleLogout = () => {
        clearStore();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F2ED] py-12 px-4 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F2ED] py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
                    {/* Avatar */}
                    <div className="mb-4 md:mb-0 md:mr-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B3A4B] to-[#8A8B6C] flex items-center justify-center text-white text-2xl font-bold">
                            {username ? username.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                    
                    {/* Info */}
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-[#1B3A4B]">
                            {username || 'Usuario'}
                        </h1>
                        <p className="text-[#8A8B6C] mt-1">
                            <span className="inline-block px-3 py-1 bg-[#F5F2ED] rounded-full text-sm">
                                {role || 'Usuario'}
                            </span>
                        </p>
                        <p className="mt-2 text-[#8A8B6C]">
                            ID: {userId || 'No disponible'}
                        </p>
                    </div>
                    
                    {/* Logout button */}
                    <div className="mt-4 md:mt-0">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#C68B59] transition duration-300"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
                
                <div className="bg-[#F5F2ED] rounded-lg p-6 space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1B3A4B] mb-4">Información del Perfil</h2>
                        <p className="text-[#1B3A4B]">
                            <span className="font-semibold">Tu rol es:</span>{' '}
                            <span className="text-[#8A8B6C]">{user?.role || role}</span>
                        </p>
                        <p className="text-[#1B3A4B] mt-2">
                            <span className="font-semibold">ID de usuario:</span>{' '}
                            <span className="text-[#8A8B6C]">{user?.userId || userId}</span>
                        </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-[#E3D5C7] mt-6">
                        <p className="text-[#8A8B6C]">
                            <span className="text-[#1B3A4B] font-semibold">Nota:</span> Próximamente podrás editar tu perfil y ver tus publicaciones favoritas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;


