import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tarea } from "../types";
import { useToastStore } from "../store/toastStore";

export function useBorrarCompletadas() {
  const queryClient = useQueryClient();
  const agregarToast = useToastStore((s) => s.agregarToast);

  return useMutation({
    mutationFn: async () => {
      const tareasCompletadas: Tarea[] =
        queryClient.getQueryData<Tarea[]>(["tareas"])?.filter((t) => t.completada) || [];

      await Promise.all(
        tareasCompletadas.map((tarea) =>
          fetch(`http://localhost:3000/tasks/${tarea.id}`, {
            method: "DELETE",
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      agregarToast("Tareas completadas eliminadas", "exito");
    },
    onError: () => {
      agregarToast("Error al borrar tareas completadas", "error");
    },
  });
}
