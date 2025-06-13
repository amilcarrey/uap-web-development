import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteCompletedTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoriaId }: { categoriaId: string }) => {
      const res = await fetch(`${API_URL}/api/tasks/completed`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoriaId }),
      });
      if (!res.ok) throw new Error("Error al eliminar las tareas completadas");
      return res.json();
    },
    onError: (_, { categoriaId }) => {
      const previousTasks = queryClient.getQueryData(["tasks", undefined, categoriaId]);
      if (previousTasks) {
        queryClient.setQueryData(["tasks", undefined, categoriaId], previousTasks);
      }
    },
    onSuccess: (_, { categoriaId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", undefined, categoriaId] });
      //undefined porque no estamos filtrando por completadas o pendientes
      // Esto le dice a React Query: "Actualizá la query de tasks" invalidando la cache del tablero correspondiente
    },
  });
}