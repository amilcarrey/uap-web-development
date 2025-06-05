// src/components/BoardSettings.tsx

import { useState } from "react";
import { useCreateBoard } from "../hooks/useAddBoard";
import { useDeleteBoard } from "../hooks/useDeleteBoard";
import { useToastStore } from "../store/toastStore";
import { useMatch } from "@tanstack/react-router"; // 👈 importante: usa useMatch
import { router } from "../router"; // 👈 importa tu instancia de router desde donde la defines

export function BoardSettings() {
  const {
    params: { boardId },
  } = useMatch({ from: "/boards/$boardId" }); // 👈 extraemos boardId directamente de la URL

  const [newBoardName, setNewBoardName] = useState("");
  const createBoard = useCreateBoard();
  const { mutate: deleteBoard, isPending: isDeleting } = useDeleteBoard();
  const { showToast } = useToastStore();

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    createBoard.mutate(newBoardName, {
      onSuccess: () => {
        showToast("Tablero creado");
        setNewBoardName("");
      },
      onError: () => showToast("Error al crear tablero", "error"),
    });
  };

  const handleDeleteBoard = () => {
    if (!confirm("¿Estás seguro de eliminar este tablero?")) return;

    deleteBoard(boardId, {
      onSuccess: () => {
        showToast("Tablero eliminado");
        router.navigate({ to: "/" });
      },
      onError: () => showToast("Error al eliminar tablero", "error"),
    });
  };

  return (
    <form onSubmit={handleCreateBoard} className="mb-4 flex items-center gap-2">
      <input
        value={newBoardName}
        onChange={(e) => setNewBoardName(e.target.value)}
        placeholder="Nuevo tablero"
        className="border rounded px-2 py-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded"
        disabled={createBoard.isPending}
      >
        Crear tablero
      </button>
      <button
        type="button"
        onClick={handleDeleteBoard}
        className="bg-red-500 text-white px-3 py-1 rounded"
        disabled={isDeleting}
      >
        Eliminar tablero
      </button>
    </form>
  );
}
