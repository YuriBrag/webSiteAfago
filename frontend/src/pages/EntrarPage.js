// frontend/src/pages/EntrarPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EntrarPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const responseData = await response.json();
      setLoading(false);

      // Trata erros específicos de forma diferente
      if (!response.ok) {
        if (response.status === 404) { // 404 Not Found
          // Sugestão para criar conta
          setError(
            <span>
              Usuário não encontrado. <Link to="/registrar" className="font-bold underline">Crie uma conta.</Link>
            </span>
          );
        } else {
          // Outros erros (ex: senha incorreta)
          throw new Error(responseData.message || 'Falha no login.');
        }
        return; // Para a execução aqui se houver erro
      }
      
      // Login bem-sucedido
      localStorage.setItem('authToken', responseData.token);
      localStorage.setItem('userName', responseData.userName);
      navigate('/perfil');

    } catch (err) {
      setLoading(false);
      // Pega erros de rede ou os que foram lançados manualmente
      setError(err.message);
    }
  };

  // O seu JSX para o formulário permanece o mesmo, mas agora
  // o {error} pode renderizar um link clicável.
  return (
     <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 pt-20">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Entrar na Plataforma
        </h2>

        {/* O estado de erro agora pode conter JSX com um link */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ... Seus campos de formulário ... */}
           <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                   className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
          </div>
          <div className="mb-6">
            <label htmlFor="password"  className="block text-gray-700 text-sm font-semibold mb-2">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
          </div>
          <button type="submit" disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-8">
          Não tem uma conta?{' '}
          <Link to="/registrar" className="font-semibold text-green-600 hover:text-green-800">
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  );
}

export default EntrarPage;