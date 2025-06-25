import { useState, useEffect } from "react";
import { useBoardUsers, useAddUserToBoard, useRemoveUserFromBoard } from "../hooks/useBoard";
import { useAuth } from "../hooks/useAuth";
import type { BoardUser } from "../types";

type BoardUsersProps = {
  boardId: string;
};

export default function BoardUsers({ boardId }: BoardUsersProps) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"read" | "write">("read");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const { data: usersData, isLoading, error, refetch } = useBoardUsers(boardId);

  const addUserToBoard = useAddUserToBoard(boardId);
  const removeUserFromBoard = useRemoveUserFromBoard(boardId);

  const boardUsers: BoardUser[] = usersData?.users || [];

  const isOwner = boardUsers?.some((u: BoardUser) =>
    String(u.user_id) === String(usersData?.currentUserId) && u.role === "owner"
  ) || false;

  const canManageUsers = isOwner;

  useEffect(() => {
    if (usersData) {
      setErrorMessage(null);
    }
  }, [usersData]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage("Por favor, introduce un email válido");
      return;
    }

    if (
      user?.email &&
      email.trim().toLowerCase() === user.email.toLowerCase()
    ) {
      setErrorMessage("No puedes añadirte a ti mismo. Ya tienes acceso a este tablero.");
      return;
    }

    addUserToBoard.mutate(
      {
        email: email.trim(),
        role: permission === "write" ? "editor" : "viewer",
      },
      {
        onSuccess: () => {
          setEmail("");
          refetch();
        },
        onError: (error: Error) => {
          setErrorMessage(error.message);
          console.error("Error al añadir usuario:", error);
        },
      }
    );
  };

  const handleRemoveUser = (userId: string) => {
    if (confirm("¿Estás seguro que quieres eliminar este usuario del tablero?")) {
      removeUserFromBoard.mutate(userId, {
        onSuccess: () => {
          refetch();
        },
        onError: (error: Error) => {
          setErrorMessage(error.message);
          console.error("Error al eliminar usuario:", error);
        },
      });
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-4">Usuarios del Tablero</h3>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-25 border border-red-500 text-white rounded">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {error ? (
        <div className="p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded">
          <p className="text-red-300">Error al cargar usuarios: {error.message}</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h4 className="text-base font-medium mb-2 text-blue-400">Usuarios con acceso</h4>
            {boardUsers.length > 0 ? (
              <ul className="space-y-2">
                {boardUsers.map((boardUser: BoardUser) => (
                  <li
                    key={boardUser.user_id}
                    className="flex justify-between items-center p-2 bg-gray-700 rounded"
                  >
                    <div>
                      <span className="block">{boardUser.name || boardUser.email}</span>
                      <span className="text-xs text-gray-400">
                        {boardUser.role === "owner"
                          ? "Propietario"
                          : boardUser.role === "editor"
                          ? "Puede editar"
                          : "Solo lectura"}
                      </span>
                    </div>
                    {canManageUsers &&
                      String(boardUser.user_id) !== String(usersData?.currentUserId) && (
                        <button
                          onClick={() => handleRemoveUser(boardUser.user_id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                          title="Eliminar usuario"
                        >
                          ✕
                        </button>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">No hay usuarios asignados a este tablero.</p>
            )}
          </div>

          {canManageUsers && (
            <div>
              <h4 className="text-base font-medium mb-2 text-blue-400">Agregar nuevo usuario</h4>
              <form onSubmit={handleAddUser} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email del usuario"
                    className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex space-x-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="permission"
                      checked={permission === "read"}
                      onChange={() => setPermission("read")}
                      className="mr-1"
                    />
                    <span className="text-sm">Solo lectura</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="permission"
                      checked={permission === "write"}
                      onChange={() => setPermission("write")}
                      className="mr-1"
                    />
                    <span className="text-sm">Puede editar</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={addUserToBoard.isPending}
                  className={`w-full ${
                    addUserToBoard.isPending
                      ? "bg-blue-800"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white py-2 rounded transition flex justify-center items-center`}
                >
                  {addUserToBoard.isPending ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Procesando...
                    </>
                  ) : (
                    "Agregar usuario"
                  )}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
} 