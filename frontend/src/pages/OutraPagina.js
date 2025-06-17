import { Link } from "react-router-dom";

function OutraPagina() {
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
			<header className="text-center mb-10">
				<h1 className="text-5xl font-bold text-purple-600">
					Pagina em Construcao
				</h1>
			</header>
			<main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
				<p className="text-gray-700 mb-6">
					No momento nao possuimos uma pagina de servicos, para saber mais entre
					em contato em nosso Whatsapp: (31) 9868-67740
				</p>
				<Link
					to="/"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out inline-block"
				>
					Voltar para Landing Page
				</Link>
			</main>
			<footer className="mt-10 text-center text-gray-500">
				<p>
					&copy; {new Date().getFullYear()} Sua Empresa. Todos os direitos
					reservados.
				</p>
			</footer>
		</div>
	);
}

export default OutraPagina;
