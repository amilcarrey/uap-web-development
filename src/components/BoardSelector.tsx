import { useAppStore } from "../store/useAppStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DEFAULT_BOARDS = ["general", "trabajo", "personal"];

export default function BoardSelector() {
  const selectedBoard = useAppStore((s) => s.selectedBoard);
  const setBoard = useAppStore((s) => s.setBoard);
  const [boards, setBoards] = useState<string[]>([]);
  const [newBoard, setNewBoard] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("boards") || "[]");
    setBoards([...DEFAULT_BOARDS, ...saved]);
  }, []);

  const updateLocalBoards = (customBoards: string[]) => {
    localStorage.setItem("boards", JSON.stringify(customBoards));
    setBoards([...DEFAULT_BOARDS, ...customBoards]);
  };

  const handleNewBoard = () => {
    const name = newBoard.trim();
    if (!name || boards.includes(name)) return;
    const customBoards = [...boards.filter(b => !DEFAULT_BOARDS.includes(b)), name];
    updateLocalBoards(customBoards);
    setBoard(name);
    setNewBoard("");
    toast.success(`Tablero "${name}" creado`);
  };

  const handleRemoveBoard = (name: string) => {
    const customBoards = boards.filter(b => !DEFAULT_BOARDS.includes(b) && b !== name);
    updateLocalBoards(customBoards);
    if (selectedBoard === name) setBoard("general");
    toast.info(`Tablero "${name}" eliminado`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleNewBoard();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">
        Tablero actual: <strong className="text-yellow-700">{selectedBoard}</strong>
      </label>

      <div className="flex flex-wrap gap-2 mb-3">
        {boards.map((b) => (
          <div key={b} className="flex items-center gap-1">
            <button
              className={`px-3 py-1 text-sm border rounded-full transition ${
                selectedBoard === b
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-600 hover:bg-yellow-100"
              }`}
              onClick={() => setBoard(b)}
            >
              {b}
            </button>
            {!DEFAULT_BOARDS.includes(b) && (
              <button
                className="text-red-400 text-xs hover:text-red-600"
                onClick={() => handleRemoveBoard(b)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border border-gray-300 px-3 py-1.5 rounded-md shadow-sm focus:outline-yellow-500"
          placeholder="Nuevo tablero"
        />
        <button
          onClick={handleNewBoard}
          className="px-4 py-1.5 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition"
        >
          Crear
        </button>
      </div>
    </div>
  );
}
