import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";

export function useDeleteTablero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API_URL}/api/tableros/delete`, {
        method: 'DELETE', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), 
      });
    },
    onSuccess: () => {
      console.log("✅ Tablero eliminado con éxito:");
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
