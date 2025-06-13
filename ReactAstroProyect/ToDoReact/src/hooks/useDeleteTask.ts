import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id}: { id: number; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar la tarea");
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