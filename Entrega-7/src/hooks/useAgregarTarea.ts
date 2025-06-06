import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";

export const useAgregarTarea = () => {
  const queryClient = useQueryClient();
  const agregarToast = useToastStore((s) => s.agregarToast);

  return useMutation({
    mutationFn: async (titulo: string): Promise<Tarea> => {
      const res = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, completada: false }),
      });
      if (!res.ok) throw new Error("Error al agregar tarea");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      agregarToast("Tarea agregada con éxito", "exito");
    },
    onError: () => {
      agregarToast("Error al agregar tarea", "error");
    },
  });
};
