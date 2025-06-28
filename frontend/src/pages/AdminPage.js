import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage1 from "../assets/background_lp.jpg";
import EditUserModal from "../components/EditUserModal.js"; 

// Componente para o card de gerenciamento de usuários
const UserManagementCard = ({ users, onEdit }) => (
  <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
      Gerenciar Usuários
    </h2>
    <ul className="space-y-2 max-h-60 overflow-y-auto">
      {users.map((user) => (
        <li
          key={user.email}
          className="flex justify-between items-center p-2 rounded-md bg-gray-50"
        >
          <div>
            <p className="font-semibold">{user.email}</p>
            <p
              className={`text-sm font-bold ${
                user.role === "admin" ? "text-red-600" : "text-gray-500"
              }`}
            >
              {user.role}
            </p>
          </div>
          <button
            onClick={() => onEdit(user)}
            className="text-blue-600 hover:underline text-sm"
          >
            Editar
          </button>
        </li>
      ))}
      {users.length === 0 && (
        <li className="text-gray-500">Nenhum usuário encontrado.</li>
      )}
    </ul>
  </div>
);

// CORREÇÃO: Definição do componente FormSubmissionsCard que estava faltando
const FormSubmissionsCard = ({ forms }) => (
  <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
      Formulários Recebidos
    </h2>
    <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {forms.map((form) => (
        <li
          key={form.nome}
          className="p-3 rounded-md bg-gray-50 hover:bg-blue-50 cursor-pointer border-l-4 border-transparent hover:border-blue-500 transition-all"
        >
          <p className="font-bold text-gray-900">
            {form.userName || "Usuário Desconhecido"}
          </p>
          <p className="text-sm text-gray-600">{form.userEmail}</p>
          <p className="text-xs text-gray-400 mt-1">{form.nome}</p>
        </li>
      ))}
      {forms.length === 0 && (
        <li className="text-gray-500 text-center py-4">
          Nenhum formulário encontrado.
        </li>
      )}
    </ul>
  </div>
);

// Componente principal da página
function AdminPage() {
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const navigate = useNavigate();

  // CORREÇÃO: Definição da função fetchAdminData que estava faltando
  const fetchAdminData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    if (!token || !userEmail) {
      setError("Sessão inválida. Por favor, faça login novamente.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      // Fetch Users
      const usersResponse = await fetch(
        `http://localhost:5001/api/admin/users?userEmail=${encodeURIComponent(
          userEmail
        )}`,
        { headers }
      );
      if (!usersResponse.ok) {
        const errData = await usersResponse.json();
        throw new Error(errData.message || "Falha ao buscar usuários.");
      }
      const usersData = await usersResponse.json();
      setUsers(usersData || []);

      // Fetch Forms
      const formsResponse = await fetch(
        `http://localhost:5001/api/admin/forms?userEmail=${encodeURIComponent(
          userEmail
        )}`,
        { headers }
      );
      if (!formsResponse.ok) {
        const errData = await formsResponse.json();
        throw new Error(errData.message || "Falha ao buscar formulários.");
      }
      const formsData = await formsResponse.json();
      setForms(formsData || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (updatedUser) => {
    const token = localStorage.getItem("authToken");
    const adminEmail = localStorage.getItem("userEmail");

    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/users/${updatedUser.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: updatedUser.role,
            userEmail: adminEmail,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Falha ao atualizar usuário.");
      }

      handleCloseModal();
      fetchAdminData();
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
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Painel do Administrador
        </h1>
        {error && (
          <p className="bg-red-500 text-white p-3 rounded-md mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {/* Bloco de Ações que estava faltando */}
            <div className="bg-slate-100 p-6 rounded-lg shadow-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Ações
              </h2>
              <div className="space-y-4">
                <Link
                  to="/listar-formularios"
                  className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Visualizar Formulários
                </Link>
                <Link
                  to="/relatorios-admin"
                  className="w-full block text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Visualizar Relatórios
                </Link>
              </div>
            </div>
          </div>
          <div className="md:col-span-1 lg:col-span-2 space-y-6">
            <UserManagementCard users={users} onEdit={handleEditClick} />
            <FormSubmissionsCard forms={forms} />
          </div>
        </div>
      </div>

      {isModalOpen && editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
}

export default AdminPage;