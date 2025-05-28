import { useMutation, useQueryClient } from "@tanstack/react-query";
//import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _method: "ADD", text }),
      });
      if (!res.ok) throw new Error("No se pudo agregar la tarea");
      return res.json();
    },
    onError: () => {
      // Si hay un error, revertimos el estado a lo que teníamos antes
      const previousTasks = queryClient.getQueryData(['tasks']);
      if (previousTasks) {
        queryClient.setQueryData(['tasks'], previousTasks);
      }
      //toast.error("Error al agregar la tarea ❌");
    },
    onSuccess: () => {
      // Esto le dice a React Query: "Actualizá la query de tasks"
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      //toast.success("Tarea agregada ✅");
    },
  });
}