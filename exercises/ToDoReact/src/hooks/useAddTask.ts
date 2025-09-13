import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, categoriaId, page }: { text: string; categoriaId: string; page: number }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _method: "ADD_TASK", text, categoriaId, page }),
      });
      if (!res.ok) throw new Error("No se pudo agregar la tarea");
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
