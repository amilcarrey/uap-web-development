import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, text,}: { id: number; text: string; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Error al editar la tarea");
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
    },
  });
}