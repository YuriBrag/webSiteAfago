import React, { useState, useEffect } from 'react';
import backgroundImage1 from '../assets/background_lp.jpg'; // Ajuste o caminho se necessário

function ListarFormulariosPage() {
    const [formularios, setFormularios] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/listar-formularios') // Porta corrigida
            .then(res => res.json())
            .then(data => setFormularios(data))
            .catch(err => console.error('Erro ao buscar formulários:', err));
    }, []);

    return (
        <div
            className="w-full min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center bg-contain md:bg-cover md:bg-fixed"
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
                        <div key={index} className="bg-white shadow-md rounded-xl p-6 transition duration-300 hover:shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{form.nome}</h2>
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

export default ListarFormulariosPage;