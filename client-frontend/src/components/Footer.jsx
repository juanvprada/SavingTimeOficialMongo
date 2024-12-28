import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-4">
      {/* Logo o Nombre del Sitio */}
      <div className="mb-6 md:mb-0 flex-1">
        <h2 className="text-2xl font-bold mb-4">Bio Blog</h2>
        <p className="text-gray-400">Tu fuente de información para un estilo de vida sostenible y ecológico.</p>
      </div>
      {/* Enlaces útiles */}
      <div className="mb-6 md:mb-0 flex-1">
        <h4 className="text-xl font-semibold mb-4">Enlaces útiles</h4>
        <ul className="space-y-2">
          <li><Link className="text-gray-400 hover:text-white" to="/">Inicio</Link></li>
          <li><Link className="text-gray-400 hover:text-white" to="/blog">Blog</Link></li>
          <li><Link className="text-gray-400 hover:text-white" to="/contacto">Contacto</Link></li>
        </ul>
      </div>
      {/* Síguenos */}
      <div className="flex-1">
        <h4 className="text-xl font-semibold mb-4">Síguenos</h4>
        <ul className="flex space-x-6">
          <li>
            <a className="text-gray-400 hover:text-white" href="https://github.com/Omarlsant/bio-blog/tree/dev" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} />
            </a>
          </li>
          <li>
            <a className="text-gray-400 hover:text-white" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </li>
          <li>
            <a className="text-gray-400 hover:text-white" href="#" target="_blank" rel="noopener noreferrer">
              <FaDiscord size={24} />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-6 pt-4 text-center">
      <p className="text-gray-400">&copy; 2024 Bio Blog. Todos los derechos reservados.</p>
    </div>
  </footer>
);

export default Footer;
