import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import icone from './assets/icone.png';

// LandingPage Component
function LandingPage() {
  const [message, setMessage] = useState('');
  const [errorInfo, setErrorInfo] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => {
        console.log('Status da resposta da API:', response.status);
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        }
        
        return response.text().then(text => {
          console.error('Resposta da API não era JSON. Conteúdo recebido:', text);
          if (text.startsWith('<!DOCTYPE html>')) {
            throw new Error('Recebido HTML em vez de JSON. Verifique o proxy e se o servidor backend está rodando na porta correta e acessível em /api/hello.');
          }
          throw new Error(`Resposta inesperada do servidor: ${response.status} ${response.statusText}. Detalhes: ${text.substring(0,100)}...`);
        });
      })
      .then(data => {
        setMessage(data.message);
        setErrorInfo('');
      })
      .catch(error => {
        console.error('Erro detalhado ao buscar dados:', error);
        setErrorInfo(`Erro ao carregar dados: ${error.message}`);
        if (!message) setMessage("Falha ao conectar com o backend.");
      });
  }, []); // Removido 'message' da dependência para evitar loops desnecessários

  return (
    // Adicionado min-w-[360px] e removido overflow-x-hidden para permitir scroll horizontal se necessário
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-20 md:pt-24 p-4 font-sans min-w-[360px]">
      <header className="text-center mb-8 sm:mb-12 w-full"> {/* Adicionado w-full para header ocupar largura disponível */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">Bem-vindo à Nossa Landing Page!</h1>
        {/* <p className="text-lg sm:text-xl text-gray-700 mt-3 sm:mt-4">Construída com React, Flask e Tailwind CSS.</p> */}
      </header>
      
      {/* Adicionado w-full para este container respeitar o min-w do pai e centralizar corretamente */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10 bg-transparent p-0 sm:p-4 md:p-6 rounded-lg w-full max-w-5xl lg:max-w-6xl">
        <div className="w-full md:w-2/5 flex justify-center md:justify-start mb-6 md:mb-0">
          <img src={icone} alt="Ícone da empresa" className="h-auto w-full max-w-xs sm:max-w-sm rounded-lg object-contain shadow-lg" />
        </div>
        
        <main className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full md:w-3/5 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">Sobre</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
            Somos uma empresa de solucoes agricolas para .... (Conteúdo mais longo aqui ficaria melhor para testar a altura)
          </p>
          
          {errorInfo ? (
            <p className="text-sm sm:text-base font-medium text-red-500 bg-red-100 p-3 rounded-md">{errorInfo}</p>
          ) : (
            <p className="text-sm sm:text-base font-medium text-indigo-600">{message || "Carregando mensagem do backend..."}</p>
          )}

          {/* ... (links e outros elementos comentados) ... */}
        </main>
      </div>

      <footer className="mt-auto pt-10 pb-6 text-center text-gray-500 text-sm w-full"> {/* Adicionado w-full */}
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// OutraPagina Component
function OutraPagina() {
  return (
    // Adicionado min-w-[360px]
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center pt-20 md:pt-24 p-4 font-sans min-w-[360px]">
      <header className="text-center mb-8 sm:mb-10 w-full"> {/* Adicionado w-full */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-600">Esta é Outra Página</h1>
      </header>
      <main className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <p className="text-gray-700 mb-6 text-sm sm:text-base">
          Conteúdo da outra página aqui.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition duration-300 ease-in-out inline-block text-sm sm:text-base"
        >
          Voltar para Landing Page
        </Link>
      </main>
       <footer className="mt-auto pt-10 pb-6 text-center text-gray-500 text-sm w-full"> {/* Adicionado w-full */}
        <p>&copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// App Component (permanece o mesmo)
function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar está fora dos containers com min-w, ela se ajustará à viewport */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/outra-pagina" element={<OutraPagina />} />
      </Routes>
    </Router>
  );
}

export default App;