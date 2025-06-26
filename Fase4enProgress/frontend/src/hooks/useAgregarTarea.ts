import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";
import { Task } from "../types";

export const useAgregarTarea = (boardId: string) => {
  const queryClient = useQueryClient();
  const agregarToast = useToastStore((s) => s.agregarToast);

  return useMutation({
    mutationFn: async (description: string): Promise<Task> => {
      const nuevaTarea = {
        description,
        completed: false,
        boardId,
      };

      console.log("📦 boardId recibido en useAgregarTarea:", boardId);
      console.log("📨 Enviando tarea:", nuevaTarea);

      const res = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(nuevaTarea),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al agregar tarea");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
      agregarToast("Tarea agregada con éxito", "exito");
    },
    onError: () => {
      agregarToast("Error al agregar tarea", "error");
    },
  });
};
