import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteCompletedTasks() {
  const queryClient = useQueryClient();

return useMutation({
    mutationFn: async ({ categoriaId }: { categoriaId: string }) => {
      console.log("categoriaId enviado desde el frontend:", categoriaId);

      const res = await fetch(`${API_URL}/api/tasks/completed?categoriaId=${categoriaId}`, {
        method: "DELETE",
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
      queryClient.invalidateQueries({
        predicate: (query) => // predicate se usa para filtrar las queries que queremos invalidar
          Array.isArray(query.queryKey) && // Verifica que queryKey sea un array
          query.queryKey[0] === "tasks" && //buscamos que el primer elemento sea tasks
          query.queryKey.includes(categoriaId), // 
      });
      //undefined porque no estamos filtrando por completadas o pendientes
      // Esto le dice a React Query: "Actualizá la query de tasks" invalidando la cache del tablero correspondiente
    },
  });
}