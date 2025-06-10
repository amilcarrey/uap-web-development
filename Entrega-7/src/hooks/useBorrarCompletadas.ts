// src/hooks/useBorrarCompletadas.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tarea } from "../types";

export const useBorrarCompletadas = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `http://localhost:3000/tasks?tableroId=${tableroId}&completada=true`
      );
      const completadas = await res.json();

      await Promise.all(
        completadas.map((t: any) =>
          fetch(`http://localhost:3000/tasks/${t.id}`, { method: "DELETE" })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
    },
  });
};