import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'; 
import icone from "../assets/icone.png";
import backgroundImage1 from "../assets/background_lp.jpg";
import backgroundImage2 from "../assets/background_lp_2.jpg";

const ContactSection = () => (
    <section id="contatos" className="w-full bg-gray-100 py-16 px-4 sm:px-6 p-10">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
            <p className="text-lg text-gray-600 mb-4">
                Estamos prontos para ajudar a proteger suas culturas.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg inline-block text-left space-y-4">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p>
                        Email:{" "}
                        <a href="mailto:afagosolucoesbiotecnologicas@gmail.com" className="text-green-700 hover:underline">
                            afagosolucoesbiotecnologicas@gmail.com
                        </a>
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <p>
                        WhatsApp:{" "}
                        <a href="https://wa.me/5531986867740" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">
                            (31) 98686-7740
                        </a>
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    <p className="text-gray-700">LinkedIn: Em breve</p>
                </div>
            </div>
        </div>
    </section>
);

function LandingPage() {
	const [message, setMessage] = useState("");
	const [errorInfo, setErrorInfo] = useState("");
	const location = useLocation();

	useEffect(() => {
        if (location.state?.scrollTo) {
            const section = document.getElementById(location.state.scrollTo);
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

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
			<section id="inicio" >
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
			</section>
			<section id="sobre" className="p-10">
				<div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10 bg-transparent p-0 sm:p-4 md:p-6 rounded-lg w-full max-w-5xl lg:max-w-6xl mx-auto">
					<div className="w-full md:w-2/5 flex justify-center md:justify-start mb-6 md:mb-0 mt-5">
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
						<p className="text-gray-600 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
							A A.fago Soluções Biotecnológicas é uma startup de biotecnologia agrícola dedicada ao desenvolvimento e fornecimento de soluções personalizadas 
							para o controle de fitopatógenos.
						</p>
						<p className="text-gray-600 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
							Nossa missão é revolucionar a proteção de culturas agrícolas por meio de biotecnologia avançada, oferecendo 
							alternativas sustentáveis e eficazes que minimizem o uso de defensivos químicos tradicionais. 
						</p>
						<p className="text-gray-600 mb-4 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
							Nossos valores incluem o compromisso com a ciência de excelência, a ética nas relações com parceiros e clientes, a valorização da 
							biodiversidade, a transparência e a busca contínua por inovação e impacto positivo no campo.
						</p>

						{/* {errorInfo ? (
							<p className="text-lg font-medium text-red-500 bg-red-100 p-3 rounded-md">
								{errorInfo}
							</p>
						) : (
							<p className="text-lg font-medium text-indigo-600">
								{message || "Carregando mensagem do backend..."}
							</p>
						)} */}
					</main>
				</div>
			</section>
			<section id="area" className="p-10">
				<div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full text-center md:text-left">
					<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 mt-10">
						Áreas de atuação
					</h2>
					<p className="text-gray-600 mb-4 text-sm sm:text-base min-h-[80px] sm:min-h-[100px]">
						Lorem ipsum dolor sit amet. Eos odio distinctio aut internos neque et
						quod quasi ea repudiandae quod. Aut sint provident et cupiditate
						soluta ut ipsam expedita et maiores magnam...
					</p>
				</div>
			</section>

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
			<section id="persp" className="p-10">
				<div className="flex flex-col items-center bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full text-center md:text-left">
					<h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6">
						Perspectivas futuras
					</h2>
					<header className="relative z-10 text-center mb-8 sm:mb-12 w-full p-4">
						<p className="text-2 sm:text-3xl  text-black mb-4 sm:mb-1">
							Lorem ipsum dolor sit amet. Et porro aliquam eos fugit
							necessitatibus qui vitae cupiditate sit dolores laudantium aut
							consequatur quibusdam...
						</p>
					</header>
				</div>
			</section>
			<ContactSection />

			<footer className="mt-auto pt-10 pb-6 text-center text-gray-500 text-sm w-full">
				<p>
					&copy; {new Date().getFullYear()} A.fago. Todos os direitos
					reservados.
				</p>
			</footer>
		</div>
	);
}

export default LandingPage;
