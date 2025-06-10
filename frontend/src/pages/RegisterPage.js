// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(responseData.message || 'Falha ao tentar cadastrar.');
      }
      
      // Cadastro bem-sucedido
      setSuccess(responseData.message);
      setTimeout(() => {
        navigate('/entrar'); // Redireciona para a página de login após o sucesso
      }, 2000); // Espera 2 segundos para o usuário ler a mensagem de sucesso

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 pt-20">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Criar Nova Conta
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* Campos de email e senha (iguais aos da página de login) */}
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
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-8">
          Já tem uma conta?{' '}
          <Link to="/entrar" className="font-semibold text-green-600 hover:text-green-800">
            Faça o login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;