import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import UserRow from '../components/UserRow';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const token = useStore((state) => state.token);
  const role = useStore((state) => state.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/acceso');
      return;
    }
    
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://savingtimeoficial.eu-4.evennode.com/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      } finally {
        setLoading(false);
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
  
  // Función para filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Función para manejar el ordenamiento
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Aplicar ordenamiento a los usuarios filtrados
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F2ED] to-[#E3D5C7]/30 py-12 px-4">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1B3A4B]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C68B59]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Encabezado mejorado */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B3A4B]/5 to-transparent"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#1B3A4B] font-playfair">
              Panel de Administración
            </h1>
            <div className="h-1 w-20 bg-[#C68B59] mb-4"></div>
            <p className="text-lg text-[#8A8B6C] max-w-3xl">
              Gestiona los usuarios, asigna roles y mantén el control de tu plataforma desde este panel centralizado.
            </p>
          </div>
        </div>
        
        {/* Panel de control con estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#1B3A4B]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8A8B6C] text-sm">Total Usuarios</p>
                <h3 className="text-2xl font-bold text-[#1B3A4B]">{users.length}</h3>
              </div>
              <div className="w-12 h-12 bg-[#1B3A4B]/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1B3A4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#C68B59]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8A8B6C] text-sm">Administradores</p>
                <h3 className="text-2xl font-bold text-[#1B3A4B]">
                  {users.filter(user => user.role === 'admin').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-[#C68B59]/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C68B59]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-[#8A8B6C]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[#8A8B6C] text-sm">Usuarios Regulares</p>
                <h3 className="text-2xl font-bold text-[#1B3A4B]">
                  {users.filter(user => user.role !== 'admin').length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-[#8A8B6C]/10 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8A8B6C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra de búsqueda y título */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold text-[#1B3A4B]">Gestión de Usuarios</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3A4B] focus:border-transparent w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Estado de carga */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
            </div>
            <p className="mt-4 text-[#8A8B6C]">Cargando usuarios...</p>
          </div>
        ) : (
          <>
            {/* Table for Larger Screens */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full">
                <thead className="bg-[#1B3A4B] text-white">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left font-semibold cursor-pointer"
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {sortConfig.key === 'email' && (
                          <span className="ml-2">
                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left font-semibold cursor-pointer"
                      onClick={() => requestSort('role')}
                    >
                      <div className="flex items-center">
                        Rol
                        {sortConfig.key === 'role' && (
                          <span className="ml-2">
                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedUsers.length > 0 ? (
                    sortedUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        token={token}
                        onRoleChange={handleRoleChange}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-[#8A8B6C]">
                        No se encontraron usuarios que coincidan con la búsqueda
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Card Layout for Mobile */}
            <div className="md:hidden space-y-4">
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white border border-[#E3D5C7] shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="mb-4 pb-3 border-b border-[#E3D5C7]">
                      <strong className="text-[#1B3A4B] block mb-1 text-sm">Email: </strong>
                      <span className="text-[#8A8B6C]">{user.email}</span>
                    </div>
                    <div className="mb-4 pb-3 border-b border-[#E3D5C7]">
                      <strong className="text-[#1B3A4B] block mb-1 text-sm">Rol: </strong>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-[#C68B59]/20 text-[#C68B59]' 
                          : 'bg-[#8A8B6C]/20 text-[#8A8B6C]'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex justify-end items-center mt-4">
                      <button
                        onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                        className={`py-2 px-4 text-white rounded-lg transition-colors duration-300 ${
                          user.role === 'admin'
                            ? 'bg-[#C68B59] hover:bg-[#8A8B6C]'
                            : 'bg-[#1B3A4B] hover:bg-[#C68B59]'
                        }`}
                      >
                        {user.role === 'admin'
                          ? 'Eliminar Admin'
                          : 'Hacer Admin'}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center text-[#8A8B6C]">
                  No se encontraron usuarios que coincidan con la búsqueda
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Paginación (opcional) */}
        {!loading && sortedUsers.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="bg-white px-4 py-3 rounded-lg shadow-md flex items-center">
              <button className="mr-2 p-2 rounded-md hover:bg-[#F5F2ED] disabled:opacity-50" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1B3A4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="px-4 py-2 bg-[#1B3A4B] text-white rounded-md">1</span>
              <button className="ml-2 p-2 rounded-md hover:bg-[#F5F2ED] disabled:opacity-50" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1B3A4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

