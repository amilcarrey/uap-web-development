import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks/${id}/toggle`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Error al alternar el estado de la tarea");
      return res.json();
    },
    onError: (_, { categoriaId, page}) => {
      const previousTasks = queryClient.getQueryData(["tasks", undefined, categoriaId,page, 7,]);
      if (previousTasks) {
        queryClient.setQueryData(["tasks", undefined, categoriaId,page, 7,], previousTasks);
      }
    },
    onSuccess: (_, { categoriaId }) => {
      queryClient.invalidateQueries({
        predicate: (query) => // predicate se usa para filtrar las queries que queremos invalidar
          Array.isArray(query.queryKey) && // Verifica que queryKey sea un array
          query.queryKey[0] === "tasks" && //buscamos que el primer elemento sea tasks
          query.queryKey.includes(categoriaId), // 
      });
    },
  });
}