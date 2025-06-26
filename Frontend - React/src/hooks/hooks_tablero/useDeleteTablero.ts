import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../components/Toast';
import { fetchAuth } from '../../utils/fetchAuth';

/**
 * Hook para eliminar un tablero por su ID.
 * Realiza una petición DELETE a la API.
 * Al finalizar con éxito, invalida las queries 'tableros' y 'tasks' para refrescar datos.
 */
export function useDeleteTablero() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { addToast } = useToasts();

  return useMutation({
    mutationFn: async (boardId: number) => {
      const res = await fetchAuth(
        `${API_URL}/api/tableros/delete/${boardId}`,
        {
          method: 'DELETE',
        },
        logout,
        addToast
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error al eliminar tablero:", errorText);
        throw new Error(errorText || 'Error al eliminar tablero');
      }

      const data = await res.json();
      return data;
    },

    onSuccess: () => {
      console.log("✅ Tablero eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },

    onError: (error: Error) => {
      console.error("❌ Error en useDeleteTablero:", error.message);
      if (addToast) addToast(`Error al eliminar tablero: ${error.message}`, "error");
    },
  });
}