import { useState } from "react";
import { useShareCategory } from "../hooks/useShareCategory";
import { useModalStore } from "../store/modalStore";

type ShareCategoryModalProps = {
  categoryId: string;
  categoryName: string;
  onClose: () => void;
};

type Role = "owner" | "editor" | "viewer";

export default function ShareCategoryModal({ categoryId, categoryName, onClose }: ShareCategoryModalProps) {
  const [userEmail, setUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("viewer");
  const [isLoading, setIsLoading] = useState(false);
  
  const shareCategoryMutation = useShareCategory();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userEmail.trim()) {
      useModalStore.getState().openModal("Por favor ingresa un email válido", "error");
      return;
    }

    setIsLoading(true);
    
    shareCategoryMutation.mutate(
      { categoryId, userEmail: userEmail.trim(), role: selectedRole },
      {
        onSuccess: () => {
          useModalStore.getState().openModal(`Tablero compartido con ${userEmail}`, "success");
          setUserEmail("");
          onClose();
        },
        onError: (error: any) => {
          useModalStore.getState().openModal(
            error.message || "Error al compartir tablero", 
            "error"
          );
        },
        onSettled: () => {
          setIsLoading(false);
        }
      }
    );
  };

  const roleDescriptions = {
    owner: "Control total (editar, eliminar, compartir)",
    editor: "Puede crear y editar tareas",
    viewer: "Solo puede ver las tareas"
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Compartir "{categoryName}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleShare} className="space-y-4">
          {/* Input de email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email del usuario:
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={isLoading}
            />
          </div>

          {/* Selector de rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de acceso:
            </label>
            <div className="space-y-2">
              {(Object.keys(roleDescriptions) as Role[]).map((role) => (
                <label key={role} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="text-orange-500 focus:ring-orange-500"
                    disabled={isLoading}
                  />
                  <div>
                    <span className="font-medium capitalize">{role}</span>
                    <p className="text-sm text-gray-600">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading && <i className="fas fa-spinner fa-spin"></i>}
              <span>{isLoading ? "Compartiendo..." : "Compartir"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}