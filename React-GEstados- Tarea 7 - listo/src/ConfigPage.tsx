import { useConfigStore, useUserStore } from "./store";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserConfig, useUpdateUserConfig } from "./hooks/useUserConfig";
import { useBoards, useCreateBoard, useDeleteBoard } from "./hooks/useBoards";

export default function ConfigPage() {
  const navigate = useNavigate();
  const setConfig = useConfigStore((s) => s.setConfig);

  // Boards: boardsData ahora es [{id, name, owner: {username: string}}]
  const { data: boardsData = [], refetch } = useBoards();
  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();
  const [newBoardName, setNewBoardName] = useState("");
  const username = useUserStore((s) => s.user?.username);

  // User config
  const { data: configData } = useUserConfig();
  const updateConfigMutation = useUpdateUserConfig();

  // Estados locales para inputs
  const [refetchInterval, setRefetchInterval] = useState(10000);
  const [mostrarMayusculas, setMostrarMayusculas] = useState(false);
  const [tareasPorPagina, setTareasPorPagina] = useState(5);

  // Sincroniza con backend al montar/config cambiar
  useEffect(() => {
    if (configData) {
      setConfig({
        refetchInterval: configData.autoRefreshInterval * 1000,
        mostrarMayusculas: configData.allTasksUppercase,
        tareasPorPagina: configData.tareasPorPagina ?? 5,
      });
      setRefetchInterval(configData.autoRefreshInterval * 1000);
      setMostrarMayusculas(configData.allTasksUppercase);
      setTareasPorPagina(configData.tareasPorPagina ?? 5);
    }
  }, [configData, setConfig]);

  // Actualiza config en backend y store
  const handleUpdateConfig = () => {
    updateConfigMutation.mutate({
      autoRefreshInterval: Math.max(1, Math.round(refetchInterval / 1000)),
      allTasksUppercase: mostrarMayusculas,
      tareasPorPagina: tareasPorPagina,
    });
    setConfig({
      refetchInterval,
      mostrarMayusculas,
      tareasPorPagina,
    });
  };

  // Boards
  const handleAddBoard = () => {
    const trimmed = newBoardName.trim();
    if (trimmed && !boardsData.some((b: any) => b.name === trimmed)) {
      createBoardMutation.mutate(trimmed, {
        onSuccess: () => {
          setNewBoardName("");
          refetch();
        },
        onError: (err: any) => alert(err.message),
      });
    }
  };

  const handleDeleteBoard = (boardId: string, boardName: string) => {
    if (
      window.confirm(
        `¿Seguro que deseas eliminar el tablero "${boardName}"? Esta acción no se puede deshacer.`
      )
    ) {
      deleteBoardMutation.mutate(boardId, {
        onSuccess: () => refetch(),
        onError: (err: any) => alert(err.message),
      });
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
          onChange={(e) => setRefetchInterval(+e.target.value)}
          className="border px-2 py-1 rounded w-full"
          min="1000"
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
            setTareasPorPagina(value === "" ? 0 : +value);
          }}
          className="border px-2 py-1 rounded w-full"
          min="1"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={mostrarMayusculas}
            onChange={(e) => setMostrarMayusculas(e.target.checked)}
            className="mr-2"
          />
          Mostrar descripciones en mayúsculas
        </label>
      </div>

      <button
        onClick={handleUpdateConfig}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      >
        Guardar Configuración
      </button>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Tableros</h3>
        <ul className="mb-4">
          {boardsData.map((b: any) => (
            <li key={b.id} className="flex justify-between items-center border p-2 mb-2 rounded">
              <span>{b.name}</span>
              {b.owner?.username === username && (
                <button
                  onClick={() => handleDeleteBoard(b.id, b.name)}
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
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddBoard();
            }}
            placeholder="Nuevo nombre de tablero"
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
        onClick={() => {
          // Redirige al primer board, si existe
          if (boardsData.length > 0) {
            navigate(`/tablero/${boardsData[0].id}`);
          } else {
            navigate("/tablero/");
          }
        }}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        Volver
      </button>
    </div>
  );
}
