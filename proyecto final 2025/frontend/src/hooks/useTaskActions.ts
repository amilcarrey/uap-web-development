// hook usado para manejar las acciones de las tareas
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const API_BASE = "http://localhost:3000";

export const useTaskActions = () => {
  const queryClient = useQueryClient();

  const refetchTasks = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const addTask = useMutation({
    mutationFn: async ({ taskText, tableroId }: { taskText: string; tableroId: string }) => {
      const response = await fetch(`${API_BASE}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: taskText, boardId: tableroId }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error agregando una tarea");
      }

      return response.json();
    },
    onSuccess: () => {
      refetchTasks();
      toast.success("Tarea agregada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error agregando la tarea");
    },
  });

  const completeTask = useMutation({
    mutationFn: async ( {id, currentCompleted} : { id: string; currentCompleted: boolean }) => {
      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete", completed: !currentCompleted }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error completando la tarea");
      return response.json();
    },
    onSuccess: (data) => {
      refetchTasks();
      const completed = data?.task?.completed;
      toast.success(
        completed ? "Tarea marcada como completada!" : "Tarea marcada como incompleta!"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error completando la tarea");
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error borrando la tarea");
    },
    onSuccess: () => {
      refetchTasks();
      toast.success("Tarea eliminada!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar la tarea");
    },
  });

  const clearCompleted = useMutation({
    mutationFn: async (boardId: string) => {
      const response = await fetch(`${API_BASE}/api/tasks/clear-completed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ boardId }), 
      });
      if (!response.ok) throw new Error("Error limpiando tareas completadas");
    },
    onSuccess: () => {
      refetchTasks();
      toast.success("Tareas completadas limpiadas!");
    },
    onError: (error: Error) => {
      console.log(error)
      toast.error(error.message || "Error limpiando tareas completadas");
    },
  });

  const editTask = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", text }),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error editando la tarea");
      }
      return response.json();
    },
    onSuccess: () => {
      refetchTasks();
      toast.success("Tarea editada correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error editando la tarea");
    },
  });

  return {
    addTask,
    completeTask,
    deleteTask,
    clearCompleted,
    editTask,
  };
};
