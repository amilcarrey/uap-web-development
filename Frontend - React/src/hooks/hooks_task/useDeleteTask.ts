import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_URL}/api/tareas/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), 
      });
    },
    onSuccess: () => {
      console.log("✅ Tarea eliminada con éxito:");
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
