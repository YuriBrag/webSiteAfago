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

    console.log('Tentando entrar com:', { email, password });

    try {
      // DESCOMENTE E AJUSTE A LINHA ABAIXO:
      const response = await fetch('http://localhost:5001/api/login', { // URL completa para o backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      setLoading(false); // Define loading como false após a resposta
      const responseData = await response.json(); // Tenta ler o corpo da resposta como JSON

      if (!response.ok) {
        // Se a resposta não for OK, lança um erro com a mensagem do backend
        throw new Error(responseData.message || `Erro ${response.status}: Falha ao tentar fazer login.`);
      }

      // Login bem-sucedido (com base na resposta do backend de teste)
      console.log('Login bem-sucedido:', responseData);

      if (responseData.token) {
        localStorage.setItem('authToken', responseData.token);
        // Você pode querer salvar responseData.userName também, se o backend o enviar
        if (responseData.userName) {
            localStorage.setItem('userName', responseData.userName);
        }
      } else {
        throw new Error('Token não recebido do servidor.');
      }
      
      navigate('/perfil'); // Redireciona para a home ou para um dashboard

      // REMOVA OU COMENTE O BLOCO setTimeout ABAIXO:
      /*
      setTimeout(() => {
        setLoading(false);
        console.log('Login simulado com sucesso!');
        navigate('/'); 
      }, 1000);
      */

    } catch (err) {
      setLoading(false);
      console.error('Erro no login:', err);
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  // ... (o restante do seu return JSX permanece o mesmo) ...
  // Certifique-se que 'brand-green' está definido no seu tailwind.config.js
  // ou substitua por uma cor padrão do Tailwind (ex: green-500, green-600)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 pt-20">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Entrar na Plataforma
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" // Exemplo com green-500
              placeholder="seuemail@exemplo.com"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" // Exemplo com green-500
              placeholder="******************"
              required
              disabled={loading}
            />
            <div className="text-right">
              <Link
                to="/esqueci-senha"
                className="text-sm text-green-600 hover:text-green-800 font-semibold" // Exemplo com green-600
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Exemplo com green-600
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-600 text-sm mt-8">
          Não tem uma conta?{' '}
          <Link
            to="/registrar"
            className="font-semibold text-green-600 hover:text-green-800" // Exemplo com green-600
          >
            Crie uma agora
          </Link>
        </p>
      </div>
      <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default EntrarPage;