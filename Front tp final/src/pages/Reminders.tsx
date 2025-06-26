// src/pages/Reminders.tsx
import { useMatch, Link } from "@tanstack/react-router";
import { ChevronLeft, MoreHorizontal, Users } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import { useToggleTask } from "../hooks/useToggleTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useClearCompleted } from "../hooks/useClearCompleted";       
import { useTaskStore } from "../store/taskStore";
import { useConfigStore } from "../store/configStore";
import TaskForm from "../components/TaskForm";
import CreateReminder from "../components/CreateReminder";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { InviteUserDialog } from "../components/InviteUserDialog";
import { useBoards } from "../hooks/useBoard"; 
import { useUsers } from "../hooks/useUsers";
import { useDebounce } from "../utils/useDobounce"; 
import { Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "completed", label: "Completados" },
  { key: "incomplete", label: "Pendientes" },
];

export default function RemindersPage() {
  const {
    params: { boardId },
  } = useMatch({ from: "/reminder/$boardId" });

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { data: boards } = useBoards();
  const { data: availableUsers = [] } = useUsers();
  const { user } = useAuth();
  const board = boards?.find((b: any) => b.id === boardId);
  const uppercaseDescriptions = useConfigStore((state: any) => state.uppercaseDescriptions);
  const { selectedTask, setSelectedTask, setConfirmDeleteTask, filter, setFilter } = useTaskStore();

  const { data, isLoading, isError } = useTasks(boardId, page, limit);
  const reminders = data?.reminders ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const toggleTask = useToggleTask();
  const { mutate: deleteTask } = useDeleteTask();
  const clearCompleted = useClearCompleted();
  const hasCompleted = reminders.some((t: any) => t.completed);

  const filteredTasks = reminders.filter((task: any) => {
    const matchesStatus =
      filter === "completed" ? task.completed :
      filter === "incomplete" ? !task.completed :
      true;

    const matchesSearch = task.name?.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) return <p className="p-4 text-center">Cargando tareas…</p>;
  if (isError) return <p className="p-4 text-red-600 text-center">Error al cargar tareas</p>;

  // Solo mostrar botón de invitar si el usuario es el propietario del tablero
  const canInviteUsers = user && board && board.owner_id === user.id;

  const handleOpenInviteDialog = () => {
    setShowInviteDialog(true);
  };
//console.log("Available Users:", availableUsers);
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      {/* ENCABEZADO */}
      <header className="flex items-center justify-between px-6 py-4 bg-pink-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-pink-600 hover:text-pink-800">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-pink-700">
            Mis Recordatorios
            {board && (
              <span className="block text-base font-normal text-pink-600">
                Tablero: {board.name}
              </span>
            )}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {canInviteUsers && (
            <button
              onClick={handleOpenInviteDialog}
              className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
              title="Invitar usuario"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Invitar</span>
            </button>
          )}
          
          <Link to="/boards/configuracion">
            <MoreHorizontal className="text-pink-600 w-6 h-6 hover:text-pink-800 transition" />
          </Link>
        </div>
      </header>

      {/* PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        <CreateReminder boardId={boardId} />

        {/* INPUT DE BÚSQUEDA */}
        <div className="relative w-full max-w-md mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recordatorios por nombre..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-pink-700 placeholder:text-pink-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-5 h-5" />
        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-pink-200">
            <p className="text-lg text-pink-700">No hay recordatorios aún</p>
            <p className="text-sm text-pink-600 mt-2">
              Crea tu primer recordatorio usando el formulario superior
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task: any) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 border border-pink-100"
              >
                {selectedTask?.id === task.id ? (
                  <TaskForm boardId={boardId} />
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    {/* Línea principal */}
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          toggleTask.mutate({ id: String(task.id), boardId })
                        }
                        className="accent-rose-500 w-5 h-5"
                      />
                      <span
                        className={`${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-pink-800"
                        } font-medium flex-1 cursor-pointer`}
                        onClick={() => setSelectedTask(task)}
                      >
                        {uppercaseDescriptions
                          ? (task.name ?? "").toUpperCase()
                          : task.name ?? ""}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          task.completed
                            ? deleteTask(task.id.toString())
                            : setConfirmDeleteTask(task);
                        }}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CONTROLES DE PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 p-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 bg-pink-500 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition"
            >
              Anterior
            </button>
            
            <span className="text-pink-700 font-medium">
              Página {page} de {totalPages}
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-pink-500 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition"
            >
              Siguiente
            </button>
          </div>
        )}

        {/* Botón "Eliminar completados" */}
        {hasCompleted && (
          <button
            onClick={() => clearCompleted.mutate(boardId)}
            disabled={clearCompleted.isPending}
            className="mt-6 w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium p-3 rounded-xl transition disabled:opacity-70"
          >
            {clearCompleted.isPending ? "Limpiando…" : "Eliminar completados"}
          </button>
        )}

        <ConfirmDeleteModal />

        {/* Modal de invitar usuario */}
        {showInviteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] max-w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Invitar Usuario</h2>
                <button
                  onClick={() => setShowInviteDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
                  <InviteUserDialog
              boardId={boardId}
              users={availableUsers ?? []}
              onClose={() => setShowInviteDialog(false)}
            />
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowInviteDialog(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="p-4 flex justify-center gap-4 bg-pink-100 border-t border-pink-200">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setPage(1); // Resetear a página 1 cuando cambies filtro
            }}
            className={
              "px-4 py-2 rounded-xl font-medium transition " +
              (filter === f.key
                ? "bg-pink-400 text-white"
                : "bg-pink-300 hover:bg-pink-400 text-white")
            }
          >
            {f.label}
          </button>
        ))}
      </footer>
    </div>
  );
}