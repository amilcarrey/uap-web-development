//src/hooks/useAgregarTarea.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";

export const useAgregarTarea = (tableroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (descripcion: string) => {
      const nuevaTarea: Omit<Tarea, "id"> = {
        descripcion,
        completada: false,
        tableroId,
      };
      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaTarea),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas", tableroId] });
    },
  });
};