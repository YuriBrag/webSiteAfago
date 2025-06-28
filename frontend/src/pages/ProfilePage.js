import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage1 from "../assets/background_lp.jpg";

const ProfileCard = ({ userName, userEmail }) => (
	<div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
		<h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
			Perfil
		</h2>
		<div className="flex items-center space-x-4 mb-4">
			<div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-10 w-10"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
			<div>
				<p className="font-semibold text-lg">{userName || "Carregando..."}</p>
				<p className="text-gray-600 text-sm">{userEmail || "Carregando..."}</p>
			</div>
		</div>
		<div className="text-right">
			<Link
				to="/editar-perfil"
				className="text-blue-600 hover:underline text-sm font-semibold"
			>
				Editar Perfil
			</Link>
		</div>
	</div>
);

const PropertiesCard = ({
	properties,
	onAddProperty,
	onSelectProperty,
	selectedProperty,
}) => {
	const [form, setForm] = useState({
		nome: "",
		tamanho: "",
		clima: "",
		solo: "",
		endereco: "",
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (form.nome.trim() && form.tamanho) {
			onAddProperty(form);
			setForm({ nome: "", tamanho: "", clima: "", solo: "", endereco: "" });
		}
	};
	return (
		<div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
				Gerenciar Propriedades
			</h2>
			<ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
				{properties.map((prop, index) => (
					<li
						key={index}
						onClick={() => onSelectProperty(prop.nome)}
						className={`p-2 rounded-md cursor-pointer transition-colors ${
							selectedProperty === prop.nome
								? "bg-green-200 font-bold"
								: "hover:bg-gray-200"
						}`}
					>
						{prop.nome}
					</li>
				))}
				{properties.length === 0 && (
					<li className="text-gray-500">Nenhuma propriedade registrada.</li>
				)}
			</ul>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-2 border-t pt-4"
			>
				<input
					name="nome"
					type="text"
					value={form.nome}
					onChange={handleChange}
					placeholder="Nome da propriedade"
					className="p-2 border rounded-md"
					required
				/>
				<input
					name="tamanho"
					type="number"
					value={form.tamanho}
					onChange={handleChange}
					placeholder="Tamanho (ha)"
					className="p-2 border rounded-md"
					required
				/>
				<input
					name="clima"
					type="text"
					value={form.clima}
					onChange={handleChange}
					placeholder="Clima"
					className="p-2 border rounded-md"
				/>
				<input
					name="solo"
					type="text"
					value={form.solo}
					onChange={handleChange}
					placeholder="Solo"
					className="p-2 border rounded-md"
				/>
				<input
					name="endereco"
					type="text"
					value={form.endereco}
					onChange={handleChange}
					placeholder="Endereço"
					className="p-2 border rounded-md"
				/>
				<button
					type="submit"
					className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition-colors font-bold"
				>
					Adicionar Propriedade
				</button>
			</form>
		</div>
	);
};

const AreasCard = ({ areas, selectedProperty, onAddArea }) => {
	const [form, setForm] = useState({
		tamanho: "",
		tipo_aplicacao: "",
		cultura: "",
		tempo_tratamento: "",
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (selectedProperty && form.tamanho) {
			onAddArea({ ...form, propertyName: selectedProperty });
			setForm({ tamanho: "", tipo_aplicacao: "", cultura: "", tempo_tratamento: "" });
		}
	};
	const filteredAreas = areas.filter(
		(area) => area.propertyName === selectedProperty
	);
	return (
		<div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
			<h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
				Gerenciar Áreas
			</h2>
			{!selectedProperty ? (
				<p className="text-gray-500">
					Selecione uma propriedade para ver as áreas.
				</p>
			) : (
				<>
					<p className="font-semibold mb-2">
						Áreas de:{" "}
						<span className="text-green-700">{selectedProperty}</span>
					</p>
					<ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
						{filteredAreas.map((area, index) => (
							<li key={index} className="p-2 rounded-md bg-gray-50">
								{area.cultura} - {area.tamanho}ha
							</li>
						))}
						{filteredAreas.length === 0 && (
							<li className="text-gray-500">
								Nenhuma área registrada para esta propriedade.
							</li>
						)}
					</ul>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-2 border-t pt-4"
					>
						<input
							name="tamanho"
							type="number"
							value={form.tamanho}
							onChange={handleChange}
							placeholder="Tamanho (ha)"
							className="p-2 border rounded-md"
							required
						/>
						<input
							name="tipo_aplicacao"
							type="text"
							value={form.tipo_aplicacao}
							onChange={handleChange}
							placeholder="Tipo de Aplicação"
							className="p-2 border rounded-md"
						/>
						<input
							name="cultura"
							type="text"
							value={form.cultura}
							onChange={handleChange}
							placeholder="Cultura"
							className="p-2 border rounded-md"
						/>
						<input
							name="tempo_tratamento"
							type="text"
							value={form.tempo_tratamento}
							onChange={handleChange}
							placeholder="Tempo de Tratamento"
							className="p-2 border rounded-md"
						/>
						<button
							type="submit"
							className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-bold"
						>
							Adicionar Área
						</button>
					</form>
				</>
			)}
		</div>
	);
};

function ProfilePage() {
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [properties, setProperties] = useState([]);
	const [areas, setAreas] = useState([]);
	const [selectedProperty, setSelectedProperty] = useState(null);
	const [error, setError] = useState("");

	const fetchData = useCallback(async (email) => {
		try {
			const response = await fetch(
				`http://localhost:5001/api/profile-data?email=${email}`
			);
			if (!response.ok) throw new Error("Falha ao buscar dados do perfil.");
			const data = await response.json();
			setProperties(data.properties || []);
			setAreas(data.areas || []);
		} catch (err) {
			setError(err.message);
		}
	}, []);

	useEffect(() => {
		const storedUserName = localStorage.getItem("userName");
		const storedUserEmail = localStorage.getItem("userEmail");
		const token = localStorage.getItem("authToken");

		if (!token || !storedUserEmail) {
			navigate("/entrar");
		} else {
			setUserName(storedUserName);
			setUserEmail(storedUserEmail);
			fetchData(storedUserEmail);
		}
	}, [navigate, fetchData]);

	const handleAddProperty = async (propertyData) => {
		try {
			const response = await fetch("http://localhost:5001/api/properties", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: userEmail, ...propertyData }),
			});
			if (!response.ok) throw new Error("Falha ao adicionar propriedade.");
			setProperties((prev) => [...prev, propertyData]);
		} catch (err) {
			setError(err.message);
		}
	};

	const handleAddArea = async (areaData) => {
		if (!selectedProperty) {
			setError("Por favor, selecione uma propriedade primeiro.");
			return;
		}
		try {
			const response = await fetch("http://localhost:5001/api/areas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: userEmail, ...areaData }),
			});
			if (!response.ok) throw new Error("Falha ao adicionar área.");
			setAreas((prev) => [...prev, { ...areaData, propertyName: selectedProperty }]);
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div
			className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-fixed relative"
			style={{ backgroundImage: `url(${backgroundImage1})` }}
		>
			<div className="absolute inset-0 bg-black opacity-60 z-0"></div>
			<div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 md:pt-32">
				{error && (
					<p className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</p>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-1 space-y-6">
						<PropertiesCard
							properties={properties}
							onAddProperty={handleAddProperty}
							onSelectProperty={setSelectedProperty}
							selectedProperty={selectedProperty}
						/>
						<Link
							to="/relatorios"
							className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
						>
							Responder Relatório
						</Link>
						<Link
							to="/responder-formulario"
							className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
						>
							Responder Formulário
						</Link>
					</div>

					<div className="md:col-span-1 lg:col-span-2 space-y-6">
						<ProfileCard userName={userName} userEmail={userEmail} />
						<AreasCard
							areas={areas}
							selectedProperty={selectedProperty}
							onAddArea={handleAddArea}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfilePage;
