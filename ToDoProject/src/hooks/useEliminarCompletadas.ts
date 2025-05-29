import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEliminarCompletadas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("http://localhost:4321/api/eliminarCompletadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("No se pudieron eliminar las tareas completadas.");
      }

      const data = await res.json();

      if (!Array.isArray(data.ids)) {
        throw new Error("Respuesta inválida del servidor. Faltan los 'ids'.");
      }

      return data.ids as number[];
    },
    onSuccess: () => {
      // Invalidar queries para que se recarguen las tareas
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
    },
  });
}