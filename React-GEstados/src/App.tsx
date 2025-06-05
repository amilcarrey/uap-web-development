import React from "react";
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
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button onClick={onClick} className="text-blue-500 hover:underline">
    {children}
  </button>
);

function App() {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const { boards } = useBoardStore();
  const { _hasHydrated, tareasPorPagina, mostrarMayusculas } = useConfigStore();

  // Hooks de zustand y lógica SIEMPRE antes de cualquier return
  const filter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);
  const pageByBoard = useTaskStore((state) => state.pageByBoard);
  const setPage = useTaskStore((state) => state.setPage);
  const page = pageByBoard[boardId ?? ""] ?? 1;

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

  // Redirige si el tablero no existe, solo después de hidratar
  React.useEffect(() => {
    if (_hasHydrated && (!boardId || !boards.includes(boardId))) {
      navigate("/tablero/personal", { replace: true });
    }
  }, [boardId, boards, _hasHydrated, navigate]);

  // Mientras hidrata o mientras el boardId no existe, no renderiza nada
  if (!_hasHydrated || !boardId || !boards.includes(boardId)) {
    return null;
  }

  // Aplicar mayúsculas si está configurado
  const processedTareas: Tarea[] = mostrarMayusculas
    ? (tareasData.tareas as Tarea[]).map((t: Tarea) => ({
        ...t,
        text: t.text.toUpperCase()
      }))
    : (tareasData.tareas as Tarea[]);

  return (
    <div className="bg-gray-0 min-h-screen">
      <header className="bg-blue-500 text-white w-full py-5 text-center">
        <h1 className="text-2xl font-bold">APP TAREAS :)</h1>
        <Link to="/configuracion" className="text-sm text-white underline">
          Configuración
        </Link>
      </header>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-5 bg-white p-3 gap-3 flex-wrap">
            {boards.map((name: string) => (
              <Link
                key={name}
                to={`/tablero/${name}`}
                className={`font-bold px-4 py-1 rounded ${
                  name === boardId
                    ? "bg-blue-500 text-white"
                    : "text-blue-500 border border-blue-500 hover:bg-blue-100"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center w-full mb-6">
            <TaskForm onAdd={(text) => handleAdd(text, boardId!)} boardId={boardId!} />
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
            <ActionButton onClick={() => clearCompletadas.mutate({ boardId: boardId! })}>
              Borrar completadas
            </ActionButton>
            <ActionButton onClick={() => clearAll.mutate({ boardId: boardId! })}>
              Borrar todo
            </ActionButton>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;