//import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import TaskFilter from "../components/TaskFilter";
import { useAppStore } from "../store/useAppStore";
import { useConfigStore } from "../store/useConfigStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTasks,
  addTask,
  deleteTask,
  toggleTask,
  clearCompleted,
  updateTaskText,
} from "../services/TaskService";
import { toast } from "react-toastify";

export default function Home() {
  //const navigate = useNavigate();
  const { filter, setFilter, selectedBoard, currentPage, setPage } = useAppStore();
  const refetchInterval = useConfigStore((s) => s.refetchInterval);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks", selectedBoard, currentPage],
    queryFn: () => fetchTasks(selectedBoard, currentPage),
    refetchInterval,
  });

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedBoard, currentPage] });
      toast.success("Tarea creada");
    },
    onError: () => toast.error("Error al crear tarea"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedBoard, currentPage] });
      toast.success("Tarea eliminada");
    },
    onError: () => toast.error("Error al eliminar tarea"),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedBoard, currentPage] });
      toast.success("Estado actualizado");
    },
    onError: () => toast.error("Error al actualizar tarea"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) => updateTaskText(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedBoard, currentPage] });
      toast.success("Tarea editada");
    },
    onError: () => toast.error("Error al editar tarea"),
  });

  const clearMutation = useMutation({
    mutationFn: clearCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", selectedBoard, currentPage] });
      toast.success("Completadas eliminadas");
    },
    onError: () => toast.error("Error al limpiar tareas"),
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center p-4">
      <div className="bg-white rounded shadow w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Tablero: {selectedBoard}</h1>

        <TaskForm onAdd={(text) => addMutation.mutate({ text, board: selectedBoard })} />

        {isLoading ? (
          <p className="text-gray-500">Cargando tareas...</p>
        ) : isError ? (
          <p className="text-red-500">Error al cargar tareas</p>
        ) : (
          <>
            <TaskList
              tasks={filteredTasks}
              onToggle={(id) => toggleMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
              onEdit={(id, text) => editMutation.mutate({ id, text })}
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-sm px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100 transition disabled:opacity-50"
              >
                ⬅ Anterior
              </button>
              <span className="text-sm text-gray-600">Página {currentPage}</span>
              <button
                onClick={() => setPage(currentPage + 1)}
                className="text-sm px-4 py-2 rounded bg-white border border-gray-300 text-gray-700 hover:bg-yellow-100 transition"
              >
                Siguiente ➡
              </button>
            </div>
          </>
        )}

        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => clearMutation.mutate(selectedBoard)}
        >
          Eliminar completadas
        </button>

        <TaskFilter filter={filter} setFilter={setFilter} />

      </div>
    </div>
  );
}