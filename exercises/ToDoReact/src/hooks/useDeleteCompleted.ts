import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteCompletedTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoriaId, page }: { categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _method: "DELETE_COMPLETED", categoriaId, page }),
      });
      if (!res.ok) throw new Error("Error al eliminar las tareas completadas");
      return res.json();
    },
    onError: (_, { categoriaId, page }) => {
      const previousTasks = queryClient.getQueryData(["tasks", undefined, categoriaId, page, 7]);
      if (previousTasks) {
        queryClient.setQueryData(["tasks", undefined, categoriaId, page, 7], previousTasks);
      }
    },
    onSuccess: (_, { categoriaId, page }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", undefined, categoriaId, page, 7] });
      //undefined porque no estamos filtrando por completadas o pendientes
      // Esto le dice a React Query: "Actualizá la query de tasks" invalidando la cache del tablero correspondiente
    },
  });
}