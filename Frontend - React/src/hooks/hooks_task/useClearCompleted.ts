import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { useAuth } from '../../context/AuthContext';
import { fetchAuth } from '../../utils/fetchAuth';

export function useClearCompleted() {
  const queryClient = useQueryClient();
  const { token, logout } = useAuth();

  return useMutation({
    mutationFn: async (boardId: string) => {
      if (!token) throw new Error('No autenticado');

      const res = await fetchAuth(
        `${API_URL}/api/tareas/clearCompleted/${boardId}`,
        {
          method: 'POST',
        },
        logout
      );

      if (!res.ok) {
        const errorJson = await res.json();
        const message = errorJson.error || 'No se pudieron eliminar las tareas completadas';
        throw new Error(message);
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
