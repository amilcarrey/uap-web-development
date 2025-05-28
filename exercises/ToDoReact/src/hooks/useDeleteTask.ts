import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _method: "DELETE", id }),
      });
      if (!res.ok) throw new Error("Error al eliminar la tarea");
      return res.json();
    },
    onError() {
      // Si hay un error, revertimos el estado a lo que teníamos antes
      const previousTasks = queryClient.getQueryData(['tasks']);
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks);
      }
      //toast.error("Error al eliminar la tarea ❌");
    },
    onSuccess: () => {
      // Esto le dice a React Query: "Actualizá la query de tasks"
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      //toast.success("Tarea eliminada ✅");
    },
  });
}