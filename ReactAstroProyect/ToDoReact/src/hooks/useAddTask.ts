import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, categoriaId }: { text: string; categoriaId: string }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ text, categoriaId }),
      });
      if (!res.ok) throw new Error("No se pudo agregar la tarea");
      return res.json();
    },
    onError: (_, { categoriaId }) => {
      const previousTasks = queryClient.getQueryData(["tasks", categoriaId]);
      if (previousTasks) {
        queryClient.setQueryData(["tasks", categoriaId], previousTasks);
      }
    },
    onSuccess: (_, { categoriaId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", categoriaId] });
    },
  });
}
