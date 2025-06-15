import React, { useState } from 'react';
import backgroundImage1 from '../assets/background_lp.jpg'; 

function ResponderFormularioPage() {
    const [efetividade, setEfetividade] = useState('');
    const [saude, setSaude] = useState('');
    const [houvePragas, setHouvePragas] = useState('');
    const [resposta, setResposta] = useState('');
    const [satisfacao, setSatisfacao] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('authToken');
        const userEmail = localStorage.getItem('userEmail');
        if (!token || !userEmail) {
            alert("Sessão inválida. Por favor, faça login novamente.");
            return;
        }

        const payload = { 
            efetividade, 
            saude, 
            houvePragas, 
            resposta: houvePragas === 'Sim' ? resposta : '', 
            satisfacao,
            userEmail 
        };

        const response = await fetch('http://localhost:5001/resp-formulario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
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

export default ResponderFormularioPage;