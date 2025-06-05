import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import icone from '../assets/icone.png'; 

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`w-full fixed top-0 z-50 transform transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-brand-green shadow-md'
        : 'bg-transparent translate-y-0'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Logo à esquerda */}
          <div className="flex items-center">
            <Link to="/" className="text-3xl sm:text-4xl font-bold">
              <img src={icone} alt="Logo" className="h-12 sm:h-16 w-auto" />
            </Link>
          </div>

          {/* Links centralizados */}
          <div className="hidden md:flex flex-1 justify-center space-x-6">
            <Link
              to="/"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/outra-pagina"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              A.Fago
            </Link>
            <Link
              to="/contato"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Serviços
            </Link>
            <Link
              to="/entrar"
              className="text-white text-base lg:text-lg font-semibold hover:text-gray-300 transition-colors duration-300 px-3 py-2 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
          </div>

          {/* Espaço à direita */}
          <div className="hidden md:block w-12"></div>

          {/* Botão Hambúrguer */}
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
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-opacity duration-300 ease-in-out`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-green">
          <Link
            to="/"
            className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Início
          </Link>
          <Link
            to="/outra-pagina"
            className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            A.Fago
          </Link>
          <Link
            to="/servicos"
            className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Serviços
          </Link>
          <Link
            to="/contato"
            className="text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Contato
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
