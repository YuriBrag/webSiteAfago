import { useState } from "react";
import backgroundImage1 from "../assets/background_lp.jpg";

export default function RelatoriosPage() {
  const [form, setForm] = useState({
    area_aplicacao: "",
    modo_aplicacao: "",
    frequencia_aplicacao: "",
    data_aplicacao: "",
    cultura: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      // Aqui você pode ajustar a URL e o método conforme o backend
      const response = await fetch("/api/relatorios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "grande_produtor", ...form })
      });
      if (!response.ok) throw new Error("Erro ao enviar relatório.");
      setSuccess("Relatório enviado com sucesso!");
      setForm({
        area_aplicacao: "",
        modo_aplicacao: "",
        frequencia_aplicacao: "",
        data_aplicacao: "",
        cultura: ""
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Relatório Grande Produtor</h2>
          {success && <p className="bg-green-500 text-white p-3 rounded mb-4">{success}</p>}
          {error && <p className="bg-red-500 text-white p-3 rounded mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              name="data_aplicacao"
              type="date"
              value={form.data_aplicacao}
              onChange={handleChange}
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
            <button
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors font-bold mt-2"
            >
              Enviar Relatório
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
