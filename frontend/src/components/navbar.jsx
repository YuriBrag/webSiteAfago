import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import icone from '../assets/icone.png'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar o menu mobile

  return (
    <nav className="bg-brand-green shadow-md w-full sticky top-0 z-50"> {/* Adicionado sticky e z-index */}
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl sm:text-4xl font-bold">
              <img src={icone} alt="Logo" className="h-12 sm:h-16 w-auto" /> {/* Exemplo se fosse usar imagem */}
            </Link>
          </div>

          {/* Links de Navegação para telas grandes (md e acima) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)} // Fecha o menu mobile se aberto e um link é clicado
            >
              Home
            </Link>
            <Link
              to="/outra-pagina" // Mantido o link para /outra-pagina como no seu exemplo original
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contato"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
            <Link
              to="/entrar"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Entrar
            </Link>
          </div>

          {/* Botão Hambúrguer para telas pequenas (abaixo de md) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Abrir menu principal"
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Ícone Hambúrguer ou X */}
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {/* A transição pode ser melhorada com bibliotecas como Headless UI ou Framer Motion para animações mais ricas */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-opacity duration-300 ease-in-out`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-green"> {/* Pode querer um tom ligeiramente diferente de bg-brand-green aqui */}
          <Link
            to="/"
            className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/outra-pagina"
            className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Sobre
          </Link>
          <Link
            to="/contato"
            className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Contato
          </Link>
          <Link
            to="/entrar"
            className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;