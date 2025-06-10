import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import icone from "./assets/icone.png";
import backgroundImage1 from "./assets/background_lp.jpg";
import backgroundImage2 from "./assets/background_lp_2.jpg";

import EntrarPage from './pages/EntrarPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ProtectedRoute from './components/ProtectedRoute.js';

function LandingPage() {
	const [message, setMessage] = useState("");
	const [errorInfo, setErrorInfo] = useState("");

	useEffect(() => {
		document.title = "A.Fago";
	}, []);

	useEffect(() => {
		fetch("/api/hello")
			.then((response) => {
				const contentType = response.headers.get("content-type");
				if (
					response.ok &&
					contentType &&
					contentType.indexOf("application/json") !== -1
				) {
					return response.json();
				}
				return response.text().then((text) => {
					if (text.startsWith("<!DOCTYPE html>")) {
						throw new Error(
							"Recebido HTML em vez de JSON. Verifique o proxy e se o servidor backend está rodando na porta correta e acessível em /api/hello."
						);
					}
					throw new Error(
						`Resposta inesperada do servidor: ${response.status} ${
							response.statusText
						}. Detalhes: ${text.substring(0, 100)}...`
					);
				});
			})
			.then((data) => {
				setMessage(data.message);
				setErrorInfo("");
			})
			.catch((error) => {
				setErrorInfo(`Erro ao carregar dados: ${error.message}`);
				if (!message) setMessage("Falha ao conectar com o backend.");
			});
	}, []);

	return (
		<div className="min-h-screen flex flex-col font-sans min-w-[360px]">
			{/* Hero com efeito parallax desativado no mobile */}
			<div
				className="w-full min-h-[300px] md:min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center
				bg-contain md:bg-cover md:bg-fixed"
				style={{ backgroundImage: `url(${backgroundImage1})` }}
			>
				<div className="absolute inset-0 bg-black opacity-50 z-0"></div>
				<header className="relative z-10 mb-8 sm:mb-12 w-full p-4">
					<h2 className="text-2xl sm:text-4xl lg:text-5xl font-medium text-white">
						Biotecnologia inteligente <br /> para um futuro sustentável
					</h2>
				</header>
			</div>

			<div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10 bg-transparent p-0 sm:p-4 md:p-6 rounded-lg w-full max-w-5xl lg:max-w-6xl mx-auto">
				<div className="w-full md:w-2/5 flex justify-center md:justify-start mb-6 md:mb-0">
					<img
						src={icone}
						alt="Ícone da empresa"
						className="h-auto w-full max-w-xs sm:max-w-sm rounded-lg object-contain shadow-lg"
					/>
				</div>

				<main className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full md:w-3/5 text-center md:text-left">
					<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">
						Sobre
					</h2>
					<p className="text-gray-600 mb-4 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
						Somos uma empresa de soluções agrícolas para .... (Conteúdo mais
						longo aqui ficaria melhor para testar a altura)
					</p>
        
         {errorInfo ? (
          <p className="text-lg font-medium text-red-500 bg-red-100 p-3 rounded-md">{errorInfo}</p>
        ) : (
          <p className="text-lg font-medium text-indigo-600">{message || "Carregando mensagem do backend..."}</p>
        )} 
				</main>
			</div>

			<div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full text-center md:text-left">
				<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">
					Áreas de atuação
				</h2>
				<p className="text-gray-600 mb-4 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
					Lorem ipsum dolor sit amet. Eos odio distinctio aut internos neque et
					quod quasi ea repudiandae quod. Aut sint provident et cupiditate
					soluta ut ipsam expedita et maiores magnam...
				</p>
			</div>

			{/* Segundo Hero com ajuste para mobile */}
			<div
				className="w-full min-h-[300px] md:min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center
				bg-contain md:bg-cover md:bg-fixed"
				style={{ backgroundImage: `url(${backgroundImage2})` }}
			>
				<div className="absolute inset-0 bg-black opacity-50 z-0"></div>
				<header className="relative z-10 text-center mb-8 sm:mb-12 w-full p-4">
					<p className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">
						Lorem ipsum dolor sit amet. Et porro aliquam eos fugit
						necessitatibus qui vitae cupiditate sit dolores laudantium aut
						consequatur quibusdam...
					</p>
				</header>
			</div>

			<div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full text-center md:text-left">
				<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">
					Perspectivas futuras
				</h2>
			</div>

			<footer className="mt-auto pt-10 pb-6 text-center text-gray-500 text-sm w-full">
				<p>
					&copy; {new Date().getFullYear()} A.fago. Todos os direitos
					reservados.
				</p>
			</footer>
		</div>
	);
}

function Perguntas() {
  const [efetividade, setEfetividade] = useState('');
  const [saude, setSaude] = useState('');
  const [houvePragas, setHouvePragas] = useState('');
  const [resposta, setResposta] = useState('');
  const [satisfacao, setSatisfacao] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      efetividade,
      saude,
      houvePragas,
      resposta: houvePragas === 'Sim' ? resposta : '',
      satisfacao,
    };

    const response = await fetch('http://localhost:5000/resp-formulario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div
				className="w-full min-h-[300px] md:min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center
				bg-contain md:bg-cover md:bg-fixed"
				style={{ backgroundImage: `url(${backgroundImage1})` }}
			>
    
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white">Submissão de Formulário</h1>
      </header>
      <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg ">
        <p className="text-gray-700 mb-6 text-ellipsis">
          
          
        <h2>Qual foi a efetividade observada? (em uma escala de 0 a 5)</h2>

        <form onSubmit={handleSubmit} id="formSatisfacao">
          <div className="flex gap-2 justify-center my-4">
            {Array.from({ length: 6 }, (_, i) => (
              <label
                key={i}
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-purple-200 transition duration-200"
              >
                <input
                  type="radio"
                  name="efetividade"
                  value={i}
                  className="hidden peer"
                  onChange={() => setEfetividade(i)}
                />
                <span className="peer-checked:bg-purple-600 peer-checked:text-white px-2 py-1 rounded">
                  {i}
                </span>
              </label>
            ))}
          </div>
        <br/>
        <h3>Qual o estado da planta após a aplicação?</h3>
        <div className="estado flex gap-4 justify-center mt-4">
          {['Sadia', 'Sintomática'].map((estado) => (
              <label key={estado} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="saude"
                  value={estado}
                  className="hidden peer"
                  onChange={() => setSaude(estado)}
                />
                <div className="w-5 h-5 rounded-full border-2 border-purple-600 mr-2 peer-checked:bg-purple-600 transition duration-200"></div>
                <span className="text-gray-700 peer-checked:font-semibold">{estado}</span>
              </label>
            ))}
        </div>
        <br/>
        <h4 className="mt-6">Houve ocorrência de pragas após a aplicação?</h4>
          <div className="pragas mt-2">
            <div className="flex gap-4 justify-center mb-2">
              {['Sim', 'Não'].map((res) => (
                <label key={res} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="houve_pragas"
                    value={res}
                    className="hidden peer"
                    onChange={() => setHouvePragas(res)}
                  />
                  <div className="w-5 h-5 rounded-full border-2 border-purple-600 mr-2 peer-checked:bg-purple-600 transition duration-200"></div>
                  <span className="text-gray-700 peer-checked:font-semibold">{res}</span>
                </label>
              ))}
            </div>

            {houvePragas === 'Sim' && (
              <input
                type="text"
                className="rounded-md w-full border border-black/50 p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                id="resposta"
                name="resposta"
                placeholder="Se sim, quais?"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
              />
            )}
          </div>

        
        <br/>
        <h5>Qual o seu nível de satisfação geral? (em uma escala de 0 a 5)</h5>
        <div className="flex gap-2 justify-center my-4">
            {Array.from({ length: 6 }, (_, i) => (
              <label
                key={i}
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-purple-200 transition duration-200"
              >
                <input
                  type="radio"
                  name="satisfacao"
                  value={i}
                  className="hidden peer"
                  onChange={() => setSatisfacao(i)}
                />
                <span className="peer-checked:bg-purple-600 peer-checked:text-white px-2 py-1 rounded">
                  {i}
                </span>
              </label>
            ))}
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
        </form>
        </p>
      </main>
       <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    
    </div>
  );
}

export {Perguntas};

function Forms() {
  return (
    
      <div
				className="w-full min-h-[300px] md:min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center
				bg-contain md:bg-cover md:bg-fixed"
				style={{ backgroundImage: `url(${backgroundImage2})` }}
			>
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-white">Formulários</h1>
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
        <br />
        <br />
        <Link
          to="/listar-formularios"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-block"
        >
          Ver o histórico de formulários
        </Link>
      </main>
       <footer className="mt-10 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function Ver_forms(){
  const [formularios, setFormularios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/listar-formularios')
      .then(res => res.json())
      .then(data => setFormularios(data))
      .catch(err => console.error('Erro ao buscar formulários:', err));
  }, []);

  return (
      <div
				className="w-full min-h-[300px] md:min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center
				bg-contain md:bg-cover md:bg-fixed"
				style={{ backgroundImage: `url(${backgroundImage1})` }}
			>
    
      <header className="text-center my-10">
        <h1 className="text-4xl font-bold text-white">Formulários Submetidos</h1>
      </header>

      <main className="w-full max-w-4xl space-y-6">
        {formularios.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">Nenhum formulário encontrado.</p>
        ) : (
          formularios.map((form, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 transition duration-300 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {form.nome}
              </h2>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{form.conteudo}</pre>
            </div>
          ))
        )}
      </main>

      <footer className="mt-12 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} A.fago. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export {Ver_forms}

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
        <Route path="/listar-formularios" element={<Ver_forms />} />
      </Routes>
    </Router>
  );
}

export default App;

