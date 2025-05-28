import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";

export function useAgregarTarea() {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: async (texto: string) => {
      const formData = new FormData();
      formData.append("texto", texto);

      const res = await fetch("http://localhost:4321/api/agregar", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error("Error al agregar tarea");
      }

      return data.tarea as Tarea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      showToast("Tarea agregada correctamente", "success");
    },
    onError: () => {
      showToast("Error al agregar tarea", "error");
    },
  });
}
