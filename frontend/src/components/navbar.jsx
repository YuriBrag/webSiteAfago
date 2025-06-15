import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole'); 
    
        navigate('/entrar');
        window.location.reload();
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMobileClick = (action) => {
        setIsOpen(false);
        if (action) {
            action();
        }
    };

    const navLinkClasses = `text-base lg:text-lg transition-colors duration-300 px-3 py-2 rounded-md hover:text-[#91d132] ${
        isScrolled ? "text-gray-800" : "text-white"
    }`;

    const mobileNavLinkClasses = "text-white hover:bg-[#91d132] block px-3 py-2 rounded-md text-base transition-colors duration-300";

    return (
        <nav
            className={`w-full fixed top-0 z-50 transform transition-all duration-300 ease-in-out ${
                isScrolled ? "bg-white shadow-md" : "bg-transparent translate-y-0"
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className={`text-3xl sm:text-4xl font-medium ${isScrolled ? "text-[#2c543c]" : "text-white"}`}>
                            A.FAGO
                        </Link>
                    </div>
                    <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
                        <Link to="/" className={navLinkClasses} onClick={() => setIsOpen(false)}>Início</Link>
                        <Link to="/outra-pagina" className={navLinkClasses} onClick={() => setIsOpen(false)}>Serviços</Link>
                        <Link to="/contatos" className={navLinkClasses} onClick={() => setIsOpen(false)}>Contatos</Link>
                        
                        {token ? (
                            <>
                                <Link to="/perfil" className={navLinkClasses} onClick={() => setIsOpen(false)}>Perfil</Link>
                                {userRole === 'admin' && (
                                    <Link to="/admin" className={`${navLinkClasses} text-red-500 font-bold`}>Admin</Link>
                                )}
                                <button onClick={handleLogout} className={`${navLinkClasses} bg-red-500 text-white hover:bg-red-600 hover:text-white`}>
                                    Sair
                                </button>
                            </>
                        ) : (
                            <Link to="/entrar" className={navLinkClasses} onClick={() => setIsOpen(false)}>
                                Entrar
                            </Link>
                        )}
                    </div>
                    
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300">
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            <div className={`md:hidden ${isOpen ? "block" : "hidden"}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-brand-green">
                    <Link to="/" className={mobileNavLinkClasses} onClick={() => handleMobileClick()}>Início</Link>
                    <Link to="/outra-pagina" className={mobileNavLinkClasses} onClick={() => handleMobileClick()}>Serviços</Link>
                    <Link to="/contatos" className={mobileNavLinkClasses} onClick={() => handleMobileClick()}>Contatos</Link>
                
                    {token ? (
                        <>
                            <Link to="/perfil" className={mobileNavLinkClasses} onClick={() => handleMobileClick()}>
                                Perfil
                            </Link>
                            {userRole === 'admin' && (
                                <Link to="/admin" className={`${navLinkClasses} text-red-500 font-bold`}>Admin</Link>
                            )}
                            <button onClick={() => handleMobileClick(handleLogout)} className={`${mobileNavLinkClasses} w-full text-left bg-red-500/50`}>
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link to="/entrar" className={mobileNavLinkClasses} onClick={() => handleMobileClick()}>
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}


export default Navbar;
