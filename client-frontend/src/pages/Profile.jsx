import React, { useEffect, useState } from 'react';
import { normalizeUrl } from '../utils/imageUtils';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
          const token = localStorage.getItem('token');
          const response = await fetch(`${normalizeUrl('/api/auth/perfil')}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`, 
            },
          });

            
            if (!response.ok) {
                const errorData = await response.json(); 
                setError(errorData.message);
            } else {
                const data = await response.json(); 
                setUser(data);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F2ED] py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {error && <p className="text-[#C68B59] text-center mb-4">{error}</p>}
                {user ? (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-[#1B3A4B] text-center">
                            Bienvenido a tu perfil
                        </h1>
                        <div className="bg-[#E3D5C7] rounded-lg p-6 space-y-4">
                            <p className="text-[#1B3A4B] text-lg">
                                <span className="font-semibold">Tu rol es:</span>{' '}
                                <span className="text-[#8A8B6C]">{user.role}</span>
                            </p>
                            <p className="text-[#1B3A4B] text-lg">
                                <span className="font-semibold">ID de usuario:</span>{' '}
                                <span className="text-[#8A8B6C]">{user.userId}</span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B] mx-auto"></div>
                        <p className="text-[#8A8B6C] mt-4">Cargando...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;



