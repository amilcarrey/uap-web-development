import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id}: { id: number; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include", // Enviar cookies con la solicitud
      });
      if (!res.ok) { 
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar tarea jeje");
      }
      
      return res.json();
    },
    onError: (_, { categoriaId, page }) => {
      const previousTasks = queryClient.getQueryData(["tasks", undefined, categoriaId, page, 7]);
      if (previousTasks) {
        queryClient.setQueryData(["tasks", undefined, categoriaId, page, 7], previousTasks);
      }
    },
    onSuccess: (_, { categoriaId }) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "tasks" &&
          query.queryKey.includes(categoriaId),
     });
    },
  });
}