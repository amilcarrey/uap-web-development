import { useConfigStore, useBoardStore } from "./store";
import { useState } from "react";
import { crearTablero } from "./api";
import { useNavigate } from "react-router-dom";

export default function ConfigPage() {
  const navigate = useNavigate();
  const {
    refetchInterval,
    mostrarMayusculas,
    tareasPorPagina,
    setConfig,
  } = useConfigStore();
  const { boards, addBoard, removeBoard } = useBoardStore();
  const [newBoardId, setNewBoardId] = useState("");

  const handleAddBoard = () => {
    const trimmed = newBoardId.trim();
    if (trimmed && !boards.includes(trimmed)) {
      addBoard(trimmed);
      crearTablero(trimmed);
      setNewBoardId("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Configuraciones</h2>

      <div className="mb-6">
        <label className="block mb-1">Intervalo de Refetch de Tareas (ms):</label>
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setConfig({ refetchInterval: +e.target.value })}
          className="border px-2 py-1 rounded w-full"
          min="0"
          step="1000"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1">Tareas por página:</label>
        <input
          type="number"
          value={tareasPorPagina === 0 ? "" : tareasPorPagina}
          onChange={(e) => {
            const value = e.target.value;
            setConfig({ tareasPorPagina: value === "" ? 0 : +value });
          }}
          className="border px-2 py-1 rounded w-full"
          min="0"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={mostrarMayusculas}
            onChange={(e) => setConfig({ mostrarMayusculas: e.target.checked })}
            className="mr-2"
          />
          Mostrar descripciones en mayúsculas
        </label>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Tableros</h3>
        <ul className="mb-4">
          {boards.map((id) => (
            <li key={id} className="flex justify-between items-center border p-2 mb-2 rounded">
              <span>{id}</span>
              {id !== "personal" && (
                <button 
                  onClick={() => removeBoard(id)} 
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>

        <div className="flex">
          <input
            type="text"
            value={newBoardId}
            onChange={(e) => setNewBoardId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddBoard();
            }}
            placeholder="Nuevo ID de tablero"
            className="border px-2 py-1 rounded mr-2 flex-1"
          />
          <button
            onClick={handleAddBoard}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Crear
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        Volver
      </button>
    </div>
  );
}