import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../types";
import { useToastStore } from "../store/toastStore";

export const useEditarTarea = () => {
  const queryClient = useQueryClient();
  const agregarToast = useToastStore((s) => s.agregarToast);

  return useMutation({
    mutationFn: async (task: Task) => {
      const res = await fetch(`http://localhost:4000/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(task),
      });
      if (!res.ok) throw new Error("Error al editar tarea");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.boardId] });
      agregarToast("Tarea editada con éxito", "exito");
    },
    onError: () => {
      agregarToast("Error al editar tarea", "error");
    },
  });
};
