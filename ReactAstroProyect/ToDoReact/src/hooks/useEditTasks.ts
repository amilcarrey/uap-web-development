import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, text, categoriaId}: { id: number; text: string; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Enviar cookies con la solicitud
        body: JSON.stringify({ text, categoriaId }),
      });
     if (!res.ok) {
  if (res.status === 401) {
    window.location.href = '/login';
    throw new Error('No autenticado');
  }
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al editar tarea");
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
        predicate: (query) => // predicate se usa para filtrar las queries que queremos invalidar
          Array.isArray(query.queryKey) && 
          query.queryKey[0] === "tasks" && //buscamos que el primer elemento sea tasks
          query.queryKey.includes(categoriaId), // 
      });
    },
  });
}