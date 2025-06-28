import { useState } from "react";

function EditUserModal({ user, onClose, onSave }) {
  // Estado interno para controlar o valor do dropdown
  const [newRole, setNewRole] = useState(user.role);

  const handleSave = () => {
    // Chama a função onSave passada pelo AdminPage
    onSave({ ...user, role: newRole });
  };

  return (
    // Overlay (fundo semi-transparente)
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Conteúdo do Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Editar Usuário</h2>
        <p className="mb-1">
          Usuário: <span className="font-semibold">{user.email}</span>
        </p>

        {/* Campo de Seleção (Dropdown) */}
        <div className="mb-6">
          <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
            Nível de Acesso
          </label>
          <select
            id="role-select"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;