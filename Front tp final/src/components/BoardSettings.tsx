
import { useState } from "react";
import { useCreateBoard } from "../hooks/useAddBoard";
//import { useDeleteBoard } from "../hooks/useDeleteBoard";
import { useToastStore } from "../store/toastStore";
import { Plus } from "lucide-react";
export function BoardSettings() {


  const [newBoardName, setNewBoardName] = useState("");
  const createBoard = useCreateBoard();
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


  return (
   
      <form
        onSubmit={handleCreateBoard}
        className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-pink-200"
      >
        <h3 className="text-lg font-bold text-pink-700 mb-3">Crear Tablero</h3>
        <div className="flex gap-2">
          <input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Escribe un nombre para el tablero..."
            className="flex-1 border border-pink-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl font-medium transition"
            disabled={createBoard.isPending}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>

  );
}
