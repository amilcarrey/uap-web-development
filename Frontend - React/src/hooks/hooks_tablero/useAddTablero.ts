import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";

export function useAddTablero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nombre: string) => {
      const res = await fetch(`${API_URL}/api/tableros/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre })
      });
      if (!res.ok) throw new Error('Error al añadir el tablero');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    }
  });
}
