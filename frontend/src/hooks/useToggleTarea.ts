import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "../types";

export const useToggleTarea = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Task) => {
      const res = await fetch(`http://localhost:4000/api/tasks/${task.id}/toggle`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al cambiar estado de tarea");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    },
  });
};
