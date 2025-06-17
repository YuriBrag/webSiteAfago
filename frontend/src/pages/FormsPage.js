import { Link } from "react-router-dom";
import backgroundImage2 from "../assets/background_lp_2.jpg"; // Ajuste o caminho se necessário

function FormsPage() {
	return (
		<div
			className="w-full min-h-screen bg-no-repeat bg-center relative flex flex-col justify-center items-center bg-contain md:bg-cover md:bg-fixed"
			style={{ backgroundImage: `url(${backgroundImage2})` }}
		>
			<div className="absolute inset-0 bg-black opacity-50 z-0"></div>
			<header className="relative text-center mb-10">
				<h1 className="text-5xl font-bold text-white">Formulários</h1>
			</header>
			<main className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
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
			<footer className="relative mt-10 text-center text-gray-500">
				<p>
					&copy; {new Date().getFullYear()} A.fago. Todos os direitos
					reservados.
				</p>
			</footer>
		</div>
	);
}

export default FormsPage;
