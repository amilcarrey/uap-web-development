import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import {
  useTareas,
  useAddTarea,
  useToggleTarea,
  useDeleteTarea,
  useClearCompletadas,
  useClearAll,
} from "./hooks/useTareas";
import { useTaskStore, useBoardStore, useConfigStore } from "./store";
import { useBoards } from "./hooks/useBoards";
import LogoutButton from "./components/LogoutButton";
import { useBoardRole } from "./hooks/useBoardRole";
import BoardPermissions from "./components/BoardPermissions";


interface Tarea {
  id: number;
  text: string;
  completada: boolean;
  boardId: string;
}

function useTareasActions() {
  const add = useAddTarea();
  const toggle = useToggleTarea();
  const remove = useDeleteTarea();

  return {
    handleAdd: (text: string, boardId: string) => add.mutate({ text, boardId }),
    handleToggle: (id: number, boardId: string) => toggle.mutate({ id, boardId }),
    handleDelete: (id: number, boardId: string) => remove.mutate({ id, boardId }),
  };
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center mt-4 gap-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
      <button
        key={num}
        onClick={() => onPageChange(num)}
        className={`px-3 py-1 rounded ${
          num === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
        disabled={totalPages === 0}
      >
        {num}
      </button>
    ))}
  </div>
);

const ActionButton = ({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`text-blue-500 hover:underline ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={disabled}
  >
    {children}
  </button>
);

function App() {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const { boards, setBoards } = useBoardStore();
  const { _hasHydrated, tareasPorPagina, mostrarMayusculas } = useConfigStore();

  // Trae boards del backend
  const { data: boardsData, isLoading: boardsLoading, error: boardsError } = useBoards();

  // Actualiza el store global de boards con [{id, name}]
  useEffect(() => {
    if (boardsData && Array.isArray(boardsData)) {
      setBoards(boardsData); // boardsData debe ser [{id, name}]
    }
  }, [boardsData, setBoards]);

  const filter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);
  const pageByBoard = useTaskStore((state) => state.pageByBoard);
  const setPage = useTaskStore((state) => state.setPage);
  const page = pageByBoard[boardId ?? ""] ?? 1;

  // Hook de permisos de rol
  const { data: role, isLoading: roleLoading } = useBoardRole(boardId ?? "");

  const {
    data: tareasData = { tareas: [], totalPages: 1, currentPage: 1 },
    isLoading,
    isError,
    error,
  } = useTareas({
    filter,
    page,
    limit: tareasPorPagina,
    boardId: boardId ?? "",
  });

  const { handleAdd, handleToggle, handleDelete } = useTareasActions();
  const clearCompletadas = useClearCompletadas();
  const clearAll = useClearAll();

  // Busca el board actual
  const currentBoard = boards.find((b) => b.id === boardId);

  // Redirige si el boardId no existe en boards (después de hidratar)
  useEffect(() => {
    if (_hasHydrated && (!boardId || !boards.some(b => b.id === boardId))) {
      if (boards.length > 0) {
        navigate(`/tablero/${boards[0].id}`, { replace: true });
      } else {
        navigate("/configuracion", { replace: true });
      }
    }
  }, [boardId, boards, _hasHydrated, navigate]);

  if (!_hasHydrated || boardsLoading || !boardId || !boards.some(b => b.id === boardId)) {
    return null;
  }
  if (boardsError) {
    return <div>Error cargando tableros: {boardsError.message}</div>;
  }
  if (roleLoading) {
    return <div className="text-center mt-10">Cargando permisos...</div>;
  }
  if (!role) {
    return (
      <div className="text-center mt-10 text-red-500">
        No tienes acceso a este tablero o no tienes permisos asignados.
      </div>
    );
  }

  const processedTareas: Tarea[] = mostrarMayusculas
    ? (tareasData.tareas as Tarea[]).map((t: Tarea) => ({
        ...t,
        text: t.text.toUpperCase()
      }))
    : (tareasData.tareas as Tarea[]);

  return (
    <div className="bg-gray-0 min-h-screen">
      <header className="bg-blue-500 text-white w-full py-5 flex items-center justify-between px-8">
        <h1 className="text-2xl font-bold text-center flex-1">
          APP TAREAS {currentBoard ? `- ${currentBoard.name}` : ""}
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/configuracion" className="text-sm text-white underline">
            Configuración
          </Link>
          <LogoutButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-5 bg-white p-3 gap-3 flex-wrap">
            {boards.map((board) => (
              <Link
                key={board.id}
                to={`/tablero/${board.id}`}
                className={`font-bold px-4 py-1 rounded ${
                  board.id === boardId
                    ? "bg-blue-500 text-white"
                    : "text-blue-500 border border-blue-500 hover:bg-blue-100"
                }`}
              >
                {board.name}
              </Link>
            ))}
          </div>

          {/* SOLO OWNER: Panel de gestión de permisos */}
          {role === "owner" && <BoardPermissions boardId={boardId!} />}

          <div className="bg-white p-4 rounded-lg shadow flex items-center w-full mb-6">
            <TaskForm
              onAdd={(text) => handleAdd(text, boardId!)}
              boardId={boardId!}
              userRole={role}
            />
          </div>

          <section className="bg-white p-7 rounded-lg shadow w-full">
            <Filters
              filtro={filter}
              onChange={(nuevo) => {
                setFilter(nuevo);
                setPage(boardId!, 1);
              }}
            />

            <div className="mt-5">
              {isLoading ? (
                <p className="text-center text-gray-500">Cargando tareas...</p>
              ) : isError ? (
                <p className="text-center text-red-500">Error: {error?.message}</p>
              ) : (
                <TaskList
                  tareas={Array.isArray(processedTareas) ? processedTareas : []}
                  onToggle={(id) => handleToggle(id, boardId!)}
                  onDelete={(id) => handleDelete(id, boardId!)}
                  loading={isLoading}
                  error={null}
                  userRole={role}
                />
              )}
            </div>
          </section>

          <Pagination
            currentPage={page}
            totalPages={tareasData.totalPages}
            onPageChange={(newPage) => setPage(boardId!, newPage)}
          />

          <div className="flex justify-between mt-4 px-2">
            <ActionButton
              onClick={() => clearCompletadas.mutate({ boardId: boardId! })}
              disabled={role === "viewer"}
            >
              Borrar completadas
            </ActionButton>
            <ActionButton
              onClick={() => clearAll.mutate({ boardId: boardId! })}
              disabled={role === "viewer"}
            >
              Borrar todo
            </ActionButton>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
