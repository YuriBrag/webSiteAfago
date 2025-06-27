import { useState } from "react";
import { Link } from "react-router-dom";
import backgroundImage1 from "../assets/background_lp.jpg";

export default function RelatoriosPage() {
  const [form, setForm] = useState({
    area_aplicacao: "",
    modo_aplicacao: "",
    frequencia_aplicacao: "",
    data_aplicacao: "",
    cultura: "",
    amostra_coletada: "",
    data_coleta: "",
    caracteristicas_amostra: "",
    sintomas_coleta: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Função para resetar o formulário e permitir um novo envio
  const handleReset = () => {
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const response = await fetch("/api/relatorios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "grande_produtor", ...form })
      });
      
      // Melhoria: Ler a mensagem de erro do backend se houver
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar relatório.");
      }
      
      const successData = await response.json();
      setSuccess(successData.message || "Relatório enviado com sucesso!");
      
      setForm({
        area_aplicacao: "",
        modo_aplicacao: "",
        frequencia_aplicacao: "",
        data_aplicacao: "",
        cultura: "",
        amostra_coletada: "",
        data_coleta: "",
        caracteristicas_amostra: "",
        sintomas_coleta: ""
      });
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
      <div className="relative z-10 w-full max-w-2xl mx-auto p-4 md:p-8 pt-24 md:pt-32">
        <div className="bg-slate-100 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Relatório do Cliente</h2>
          
          {success ? (
            // Se 'success' tiver uma mensagem, mostra apenas isto:
            <div className="text-center">
              <p className="bg-green-500 text-white p-4 rounded mb-4 text-lg">{success}</p>
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-bold"
              >
                Enviar Novo Relatório
              </button>
              <br />
              <br />
              <Link
                  to="/responder-formulario"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-bold"
                >
                  Responder Formulário de Satisfação
              </Link>
            </div>
          ) : (
            // Caso contrário, mostra o formulário (e qualquer erro que possa ocorrer)
            <>
              {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-2xl text-gray-800">Aplicação de Coquetel</h3>
                {/* Corrigi o 'classname' para 'className' aqui */}
                <h5 className="text-gray-800">Data da aplicação:</h5>
                <input
                  name="data_aplicacao"
                  type="date"
                  value={form.data_aplicacao}
                  onChange={handleChange}
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="area_aplicacao"
                  type="text"
                  value={form.area_aplicacao}
                  onChange={handleChange}
                  placeholder="Área de Aplicação"
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="modo_aplicacao"
                  type="text"
                  value={form.modo_aplicacao}
                  onChange={handleChange}
                  placeholder="Modo de Aplicação"
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="frequencia_aplicacao"
                  type="text"
                  value={form.frequencia_aplicacao}
                  onChange={handleChange}
                  placeholder="Frequência de Aplicação"
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="cultura"
                  type="text"
                  value={form.cultura}
                  onChange={handleChange}
                  placeholder="Cultura"
                  className="p-2 border rounded-md"
                  required
                />
                <h3 className="text-2xl text-gray-800">Avaliação de qualidade</h3>
                {/* Corrigi o 'classname' para 'className' aqui */}
                <h4 className="text-gray-800">Data da coleta:</h4>
                <input
                  name="data_coleta"
                  type="date"
                  value={form.data_coleta}
                  onChange={handleChange}
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="amostra_coletada"
                  type="text"
                  value={form.amostra_coletada}
                  onChange={handleChange}
                  placeholder="Amostra coletada"
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="caracteristicas_amostra"
                  type="text"
                  value={form.caracteristicas_amostra}
                  onChange={handleChange}
                  placeholder="Características da amostra coletada"
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  name="sintomas_coleta"
                  type="text"
                  value={form.sintomas_coleta}
                  onChange={handleChange}
                  placeholder="Sintomas da planta no dia da coleta"
                  className="p-2 border rounded-md"
                  required
                />

                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-bold mt-2"
                >
                  Enviar Relatório
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}