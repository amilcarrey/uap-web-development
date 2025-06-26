import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../components/Toast';
import { fetchAuth } from '../../utils/fetchAuth'; 

/**
 * Hook para añadir un nuevo tablero.
 * Realiza una llamada POST a la API para crear un tablero nuevo y
 * luego invalida la caché de la query 'tableros' para refrescar la lista.
 */

export function useAddTablero() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { addToast } = useToasts();

  return useMutation({
    mutationFn: async (nombre: string) => {
      const res = await fetchAuth(
        `${API_URL}/api/tableros/add`,
        {
          method: 'POST',
          body: JSON.stringify({ nombre }),
        },
        logout,
        addToast
      );

      if (!res.ok) throw new Error('Error al añadir el tablero');

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    }
  });
}
