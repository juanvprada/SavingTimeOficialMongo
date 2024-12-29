import React from 'react';
import axios from 'axios';

const UserRow = ({ user, token, onRoleChange }) => {
    const handleToggleAdmin = async () => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            await axios.put(
                `http://localhost:5000/api/roles/${user.id}`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onRoleChange(user.id, newRole);  // Update role locally
        } catch (error) {
            console.error('Error al actualizar el rol del usuario:', error);
        }
    };

    return (
        <tr className="hover:bg-[#E3D5C7] transition">
            <td className="border-b p-4 text-[#1B3A4B]">{user.email}</td>
            <td className="border-b p-4 text-[#8A8B6C]">{user.role}</td>
            <td className="border-b p-4">
                <button
                    onClick={handleToggleAdmin}
                    className={`py-2 px-4 text-white rounded-full ${user.role === 'admin'
                            ? 'bg-[#C68B59] hover:bg-[#8A8B6C]'
                            : 'bg-[#1B3A4B] hover:bg-[#8A8B6C]'
                        } transition`}
                >
                    {user.role === 'admin' ? 'Eliminar Admin' : 'Hacer Admin'}
                </button>
            </td>
        </tr>
    );
};

export default UserRow;
