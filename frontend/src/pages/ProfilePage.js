// frontend/src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // Ao carregar a página, busca o nome do usuário do localStorage
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      // Se não houver usuário logado (sem token), redireciona para a página de entrar
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/entrar');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Limpa os dados de autenticação do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');

    // Redireciona para a página de login
    navigate('/entrar');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pt-24">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Bem-vindo(a), {userName || 'Usuário'}!
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Sair
          </button>
        </div>

        <p className="text-gray-600 mb-8">Esta é a sua página de perfil. Aqui você pode gerenciar suas informações e acessar funcionalidades exclusivas.</p>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ações</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            
            {/* Opção "Relatórios" */}
            <Link
              to="/relatorios" // Esta rota precisará ser criada
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-300"
            >
              Relatórios
            </Link>

            {/* Adicione outros links/botões aqui conforme necessário */}
            <Link
              to="/configuracoes" // Exemplo de outra rota
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors duration-300"
            >
              Configurações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;