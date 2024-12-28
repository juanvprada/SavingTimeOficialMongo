import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoImg } from "../utils";
import useStore from "../store/store";
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useStore((state) => !!state.token);
  const username = useStore((state) => state.username);
  const role = useStore((state) => state.role);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigateToRegister = () => {
    navigate(location.pathname === "/acceso" ? "/" : "/acceso");
  };

  const handleLogout = () => {
    // Limpiar el estado de Zustand
    useStore.getState().setToken(null);
    useStore.getState().setRole(null);
    useStore.getState().setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center">
          <img src={logoImg} className="w-10 h-10" alt="logo" />
          <Link to="/" className="ml-3 text-xl font-bold text-white">
            Bio Blog
          </Link>
        </div>

        {/* Menú en pantallas grandes */}
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
          </ul>
          {isLoggedIn ? (
            <>
              <span className="text-gray-300">
                Hola, <strong>{username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-green-400 focus:outline-none ml-4"
                title="Cerrar Sesión"
              >
                <FaSignOutAlt size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={navigateToRegister}
              className="text-gray-300 hover:text-green-400 focus:outline-none"
              title="Registrarse"
            >
              {/* <FaUserPlus size={20} /> */}
            </button>
          )}
        </div>

        {/* Botón para menú móvil */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-green-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 shadow-md">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link
                className="text-gray-300 hover:text-green-400"
                to="/"
                onClick={toggleMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-300 hover:text-green-400"
                to="/blog"
                onClick={toggleMenu}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-300 hover:text-green-400"
                to="/nosotros"
                onClick={toggleMenu}
              >
                Nosotros
              </Link>
            </li>
            <li>
              <Link
                className="text-gray-300 hover:text-green-400"
                to="/contacto"
                onClick={toggleMenu}
              >
                Contacto
              </Link>
            </li>
            {role === "admin" && (
              <li>
                <Link
                  className="text-gray-300 hover:text-green-400"
                  to="/admin"
                  onClick={toggleMenu}
                >
                  Admin
                </Link>
              </li>
            )}
            {isLoggedIn ? (
              <>
                <li className="text-gray-300">
                  Hola, <strong>{username}</strong>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="text-gray-300 hover:text-green-400 focus:outline-none"
                    title="Cerrar Sesión"
                  >
                    <FaSignOutAlt size={20} />
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    navigateToRegister();
                    toggleMenu();
                  }}
                  className="text-gray-300 hover:text-green-400 focus:outline-none"
                  title="Registrarse"
                >
                  <FaUserPlus size={20} />
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

