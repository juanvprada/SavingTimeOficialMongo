import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/perfil', {
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
        <div>
            {error && <p>{error}</p>}
            {user ? (
                <div>
                    <h1>Bienvenido a tu perfil</h1>
                    <p>Tu rol es: {user.role}</p>
                    <p>ID de usuario: {user.userId}</p>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default Profile;



