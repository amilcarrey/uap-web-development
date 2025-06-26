// components/InviteUserDialog.tsx
import { useInviteUser } from "../hooks/useInviteUser";
import { useToastStore } from "../store/toastStore";
import { useState } from "react";
import { UserPlus } from "lucide-react";
// interface User {
//   id: string;
//   username: string;
// }

interface InviteUserDialogProps {
  boardId: string;
  users?: any; // Cambiar para aceptar objetos
  onClose?: () => void;
}

export function InviteUserDialog({ boardId, users, onClose }: InviteUserDialogProps) {
  const inviteUser = useInviteUser(boardId);
  const { showToast } = useToastStore();
  const [selectedUser, setSelectedUser] = useState("");
  const [accessLevel, setAccessLevel] = useState("viewer");

  const handleInvite = () => {
    if (!selectedUser) {
      showToast("Por favor selecciona un usuario", "error");
      return;
    }

    inviteUser.mutate(
      { user_id: selectedUser, access_level: accessLevel },
      {
        onSuccess: () => {
          showToast("Usuario invitado exitosamente", "success");
          setSelectedUser("");
          setAccessLevel("viewer");
          onClose?.();
        },
        onError: (error: any) => {
          showToast(
            error.message || "Error al invitar usuario",
            "error"
          );
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Selector de usuario */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usuario
        </label>
        <select 
          value={selectedUser} 
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-700"
        >
          <option value="">--Selecciona usuario--</option>
          {users && users.users && Array.isArray(users.users) ? (
            users.users.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.username || `Usuario ${u.id}`}
              </option>
            ))
          ) : (
            <option value="" disabled>
              {!users ? "Cargando usuarios..." : "No hay usuarios disponibles"}
            </option>
          )}
        </select>
      </div>

      {/* Selector de nivel de acceso */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel de acceso
        </label>
        <select 
          value={accessLevel} 
          onChange={(e) => setAccessLevel(e.target.value)}
          className="w-full border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-700"
        >
          <option value="viewer">Solo lectura</option>
          <option value="full_access">Acceso completo</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {accessLevel === "viewer" 
            ? "El usuario podrá ver el tablero pero no modificarlo"
            : "El usuario podrá ver y modificar el tablero"
          }
        </p>
      </div>

      {/* Botón de invitar */}
      <button 
        onClick={handleInvite} 
        disabled={inviteUser.isPending || !selectedUser}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        {inviteUser.isPending ? "Invitando..." : "Invitar usuario"}
      </button>

      {/* Mostrar errores */}
      {inviteUser.isError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {(inviteUser.error as Error)?.message || "Error al invitar usuario"}
        </div>
      )}
    </div>
  );
}
