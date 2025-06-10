import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tarea } from "../types";

export const useToggleTarea = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tarea: Tarea) => {
      const res = await fetch(`http://localhost:3000/tasks/${tarea.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !tarea.completada }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
    },
  });
};
