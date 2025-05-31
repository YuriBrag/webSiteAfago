import React from 'react';
import { Link } from 'react-router-dom';
import icone from '../assets/icone.png'; 

function Navbar() {
  return (
    <nav className="bg-brand-green shadow-md w-full">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center cellPadding-150">
        <div className="flex items-center">
          <Link to="/" className='text-5xl font-bold text-white'>
            A.Fago
            {/* <img src={icone} alt="Logo" className="h-20 w-auto" />  */}
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-300"
          >
            Home
          </Link>
          <Link 
            // to="/produtos" 
            to="/outra-pagina"
            className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-300"
          >
            Sobre
          </Link>
          <Link 
            to="/contato" 
            className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-300"
          >
            Contato
          </Link>
          <Link 
            to="/entrar" 
            className="text-white text-lg font-semibold hover:text-gray-300 transition-colors duration-300"
          >
            Entrar
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
