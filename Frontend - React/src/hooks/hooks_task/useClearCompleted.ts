import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";

export function useClearCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/tareas/clearCompleted`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('No se pudieron eliminar las tareas completadas');
      }

      const data = await res.json(); 
      return data; 
    },
    onSuccess: (data) => {
      console.log(`✅ Tareas completadas eliminadas: ${data.eliminadas}`);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
