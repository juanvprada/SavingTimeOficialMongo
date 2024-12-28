import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const token = useStore((state) => state.token);
  const role = useStore((state) => state.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/acceso'); 
      return;
    }
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsers();
  }, [token, role, navigate]);

  const handleToggleAdmin = async (userId) => {
    try {
      const user = users.find((user) => user.id === userId);
      const newRole = user.role === 'admin' ? 'user' : 'admin';

      await axios.patch(
        `http://localhost:5000/api/roles/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      if (error.response) {
        console.error('Datos del error:', error.response.data);
        console.error('Status del error:', error.response.status);
        console.error('Headers del error:', error.response.headers);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
      } else {
        console.error('Error al configurar la solicitud:', error.message);
      }
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">Gestión de Usuarios</h1>
        <p className="text-lg text-gray-600">Administra los usuarios y sus roles en el sistema</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b p-4 text-left font-semibold text-gray-600">Email</th>
              <th className="border-b p-4 text-left font-semibold text-gray-600">Rol</th>
              <th className="border-b p-4 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="border-b p-4">{user.email}</td>
                <td className="border-b p-4">{user.role}</td>
                <td className="border-b p-4">
                  <button
                    onClick={() => handleToggleAdmin(user.id)}
                    className={`py-2 px-4 text-white rounded-full ${user.role === 'admin' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                  >
                    {user.role === 'admin' ? 'Eliminar Admin' : 'Hacer Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
