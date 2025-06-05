
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import icone from './assets/icone.png'; 

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
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-black-600">Bem-vindo à Nossa Landing Page!</h1>
        {/* <p className="text-xl text-gray-700 mt-4">Construída com React, Flask e Tailwind CSS.</p> */}
      </header>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-transparent p-8 rounded-lg">
        <div className="w-full mr-10 md:w-1/2 flex justify-center md:justify-start">
          <img src={icone} alt="Ícone da empresa" className="h-auto w-full max-w-xs md:max-w-sm rounded-lg object-contain" />    
        </div>
        <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sobre</h2>
        <p className="text-gray-600 mb-4 h-40">
          Somos uma empresa de solucoes agricolas para ....
        </p>
        
         {errorInfo ? (
          <p className="text-lg font-medium text-red-500 bg-red-100 p-3 rounded-md">{errorInfo}</p>
        ) : (
          <p className="text-lg font-medium text-indigo-600">{message || "Carregando mensagem do backend..."}</p>
        )} 

        {/* <div className="mt-8">
          <Link
            to="/outra-pagina"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 inline-block"
          >
            Ir para Outra Página
          </Link>
        </div> */}
      </main>
      </div>

      <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function Perguntas() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-purple-600">Submissão de Formulário</h1>
      </header>
      <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg ">
        <p className="text-gray-700 mb-6 text-ellipsis">
          
          
        <h2>Qual foi a efetividade observada? (em uma escala de 0 a 5)</h2>

        <form id="formSatisfacao">
          <div class="escala">
            <label><input type="radio" name="efetividade" value="0" /> 0 </label>
            <label><input type="radio" name="efetividade" value="1" /> 1 </label>
            <label><input type="radio" name="efetividade" value="2" /> 2 </label>
            <label><input type="radio" name="efetividade" value="3" /> 3 </label>
            <label><input type="radio" name="efetividade" value="4" /> 4 </label>
            <label><input type="radio" name="efetividade" value="5" /> 5 </label>
          </div>
        <br/>
        <h3>Qual o estado da planta após a aplicação?</h3>
        <div class="estado">
          <label><input type="radio" name="saude" value="Sadia"/> Sadia </label><br />
          <label><input type="radio" name="saude" value="Sintomática"/> Sintomática </label>
        </div>
        <br/>
        <h4>Houve ocorrencia de pragas após a aplicação?</h4>
        <div class="pragas">
          <label><input type="radio" name="houve_pragas" value="Sim"/> Sim </label><br />
          <label><input type="radio" name="houve_pragas" value="Não"/> Não </label><br />
          <input type="text"  class=" rounded-md w-80 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 "
           id="resposta" name="resposta" rows="1" cols="40" placeholder="Se sim, quais?"></input><br />
        </div>

        </form>
        <br/>
        <h5>Qual o seu nível de satisfação geral? (em uma escala de 0 a 5)</h5>
        <div class="satisfacao_geral">
            <label><input type="radio" name="satisfacao" value="0" /> 0 </label>
            <label><input type="radio" name="satisfacao" value="1" /> 1 </label>
            <label><input type="radio" name="satisfacao" value="2" /> 2 </label>
            <label><input type="radio" name="satisfacao" value="3" /> 3 </label>
            <label><input type="radio" name="satisfacao" value="4" /> 4 </label>
            <label><input type="radio" name="satisfacao" value="5" /> 5 </label>
        </div>
        <br/>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
          >
            Enviar
          </button>
          <div id="respostaUsuario" className="mt-4 text-white font-medium"></div>
        </div>
        </p>
      </main>
       <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function Forms() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-purple-600">Esta é Outra Página</h1>
      </header>
      <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <p className="text-gray-700 mb-6">
          Esta é a página de formulários
        </p>
        <Link
          to="/responder-formulario"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-block"
        >
          Responder formulário
        </Link>
      </main>
       <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function OutraPagina() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-purple-600">Esta é Outra Página</h1>
      </header>
      <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <p className="text-gray-700 mb-6">
          Conteúdo da outra página aqui.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-block"
        >
          Voltar para Landing Page
        </Link>
      </main>
       <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formularios" element={<Forms />} />
        <Route path="/responder-formulario" element={<Perguntas />} />
        <Route path="/outra-pagina" element={<OutraPagina />} />
      </Routes>
    </Router>
  );
}

export default App;

