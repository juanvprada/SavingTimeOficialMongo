import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoImg } from "../utils";
import useStore from "../store/store";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

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

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    useStore.getState().setToken(null);
    useStore.getState().setRole(null);
    useStore.getState().setUsername(null);
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
    closeMenu();
  };

  const navigateToRegister = () => {
    navigate(location.pathname === "/acceso" ? "/" : "/acceso");
  };

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img src={logoImg} className="w-10 h-10" alt="logo" />
          {/* <Link to="/" className="ml-3 text-xl font-bold text-white">
            Saving Time
          </Link> */}
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
            />
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



