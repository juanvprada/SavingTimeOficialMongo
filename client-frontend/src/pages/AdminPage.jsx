import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import UserRow from '../components/UserRow';

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
        console.log(response.data);
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
    fetchUsers();
  }, [token, role, navigate]);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="container mx-auto py-12 px-4 bg-[#F5F2ED]">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 text-[#1B3A4B]">
          Gestión de Usuarios
        </h1>
        <p className="text-lg text-[#8A8B6C]">
          Administra los usuarios y sus roles en el sistema
        </p>
      </div>

      {/* Table for Larger Screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-[#E3D5C7] shadow-md rounded-lg">
          <thead className="bg-[#1B3A4B] text-white">
            <tr>
              <th className="border-b p-4 text-left font-semibold">Email</th>
              <th className="border-b p-4 text-left font-semibold">Rol</th>
              <th className="border-b p-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) &&
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  token={token}
                  onRoleChange={handleRoleChange}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* Card Layout for Mobile */}
      <div className="md:hidden space-y-4">
        {Array.isArray(users) &&
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-[#E3D5C7] shadow-md rounded-lg p-6"
            >
              <div className="mb-2">
                <strong className="text-[#1B3A4B]">Email: </strong>
                <span>{user.email}</span>
              </div>
              <div className="mb-2">
                <strong className="text-[#1B3A4B]">Rol: </strong>
                <span>{user.role}</span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleRoleChange(user.id, 'admin')}
                  className={`py-2 px-4 text-white rounded ${
                    user.role === 'admin'
                      ? 'bg-[#C68B59] hover:bg-[#8A8B6C]'
                      : 'bg-[#1B3A4B] hover:bg-[#8A8B6C]'
                  }`}
                >
                  {user.role === 'admin'
                    ? 'Eliminar Admin'
                    : 'Hacer Admin'}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminPage;

