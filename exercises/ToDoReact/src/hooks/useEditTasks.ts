import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, text, categoriaId, page }: { id: number; text: string; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _method: "EDIT_TASK", id, text, categoriaId, page }),
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