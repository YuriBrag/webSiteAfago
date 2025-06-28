import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backgroundImage1 from "../assets/background_lp.jpg";

function RelatoriosAdminPage() {
  const [relatorios, setRelatorios] = useState([]);
  const [selectedRelatorio, setSelectedRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRelatorios = async () => {
      const token = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");

      if (!token || !userEmail) {
        setError("Sessão inválida. Faça login novamente.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5001/api/admin/relatorios?userEmail=${encodeURIComponent(userEmail)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Falha ao buscar relatórios.");
        }

        const data = await response.json();
        setRelatorios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatorios();
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-no-repeat bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage1})` }}
    >
      <div className="min-h-screen w-full bg-black bg-opacity-60">
        <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 pt-24 md:pt-32">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Visualização de Relatórios
            </h1>
            <Link
              to="/admin"
              className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              &larr; Voltar ao Painel
            </Link>
          </div>

          {loading && <p className="text-white text-center">Carregando relatórios...</p>}
          {error && <p className="bg-red-500 text-white p-3 rounded-md">{error}</p>}
          
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Coluna da Lista de Relatórios */}
              <div className="md:col-span-1 bg-slate-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                  Relatórios Enviados
                </h2>
                <ul className="space-y-2 h-[60vh] overflow-y-auto">
                  {relatorios.length > 0 ? (
                    relatorios.map((relatorio) => (
                      <li
                        key={relatorio.id}
                        onClick={() => setSelectedRelatorio(relatorio)}
                        className={`p-3 rounded-md cursor-pointer transition-all ${
                          selectedRelatorio?.id === relatorio.id
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-50 hover:bg-blue-100"
                        }`}
                      >
                        <p className="font-semibold">Relatório</p>
                        <p className="text-xs">{relatorio.dados.data_da_aplicação || relatorio.id}</p>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500 p-3">Nenhum relatório encontrado.</p>
                  )}
                </ul>
              </div>

              {/* Coluna de Detalhes do Relatório */}
              <div className="md:col-span-2 bg-slate-100 p-6 rounded-lg shadow-md h-fit">
                {selectedRelatorio ? (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                      Detalhes do Relatório
                    </h2>
                    <div className="space-y-3">
                      {Object.entries(selectedRelatorio.dados).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm font-bold text-gray-500 capitalize">
                            {key.replace(/_/g, " ")}
                          </p>
                          <p className="text-gray-800 text-lg">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <p className="text-gray-500 text-xl">
                      Selecione um relatório na lista para ver os detalhes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RelatoriosAdminPage;