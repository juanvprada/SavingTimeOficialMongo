import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoImg } from "../utils";
import useStore from "../store/store";
import { FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Usar selectores individuales en lugar de derivar valores
  const token = useStore((state) => state.token);
  const username = useStore((state) => state.username);
  const role = useStore((state) => state.role);
  
  // Derivar isLoggedIn de token
  const isLoggedIn = !!token;
  const isBlogPage = location.pathname === "/blog";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    const clearStore = useStore.getState().clearStore;
    if (clearStore) {
      clearStore();
    } else {
      // Fallback para compatibilidad
      useStore.getState().setToken(null);
      useStore.getState().setRole(null);
      useStore.getState().setUsername(null);
      useStore.getState().setUserId(null);
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
    }
    navigate("/");
    closeMenu();
  };

  const navigateToLogin = () => {
    navigate("/acceso");
    closeMenu();
  };

  return (
    <nav className={`bg-gray-900 shadow-md ${isBlogPage ? 'hidden md:block' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logoImg} className="w-10 h-10" alt="logo" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex items-center space-x-6">
            <li>
              <Link className="text-gray-300 hover:text-green-400" to="/">
                Inicio
              </Link>
            </li>
            <li>
              <Link className="text-gray-300 hover:text-green-400" to="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link className="text-gray-300 hover:text-green-400" to="/nosotros">
                Nosotros
              </Link>
            </li>
            <li>
              <Link className="text-gray-300 hover:text-green-400" to="/contacto">
                Contacto
              </Link>
            </li>
            {role === "admin" && (
              <li>
                <Link className="text-gray-300 hover:text-green-400" to="/admin">
                  Admin
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <Link className="text-gray-300 hover:text-green-400" to="/perfil">
                  <span className="flex items-center">
                    <FaUser className="mr-2" size={16} />
                    Mi Perfil
                  </span>
                </Link>
              </li>
            )}
          </ul>
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-green-400 focus:outline-none"
              title="Cerrar Sesión"
            >
              <FaSignOutAlt size={20} />
            </button>
          ) : (
            <button
              onClick={navigateToLogin}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md focus:outline-none"
            >
              Acceder
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-green-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          ></div>

          <div
            className="fixed top-0 left-0 h-auto w-48 bg-gray-900 shadow-lg transform transition-transform z-50 rounded-br-lg"
          >
            <ul className="py-6 px-6 space-y-6">
              <li>
                <Link
                  className="text-gray-300 hover:text-green-400"
                  to="/"
                  onClick={closeMenu}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-green-400"
                  to="/blog"
                  onClick={closeMenu}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-green-400"
                  to="/nosotros"
                  onClick={closeMenu}
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-300 hover:text-green-400"
                  to="/contacto"
                  onClick={closeMenu}
                >
                  Contacto
                </Link>
              </li>
              {isLoggedIn && (
                <li>
                  <Link
                    className="text-gray-300 hover:text-green-400"
                    to="/perfil"
                    onClick={closeMenu}
                  >
                    <span className="flex items-center">
                      <FaUser className="mr-2" size={16} />
                      Mi Perfil
                    </span>
                  </Link>
                </li>
              )}
              {role === "admin" && (
                <li>
                  <Link
                    className="text-gray-300 hover:text-green-400"
                    to="/admin"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-green-400 flex items-center space-x-2"
                  >
                    <FaSignOutAlt size={20} />
                    <span>Salir</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;