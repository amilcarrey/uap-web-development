import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../../components/TaskManager';
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../components/Toast';
import { fetchAuth } from '../../utils/fetchAuth'; 

// Tipos para los datos de entrada y la respuesta de la API
export type PermisoInput = {
  boardId: number;
  userId: number;
  role: 'propietario' | 'editor' | 'lectura';
};

export type PermisoResponse = {
  message: string;
  boardUser: {
    boardId: number;
    userId: number;
    role: string;
  };
};

/**
 * Hook para asignar permisos a un usuario en un tablero.
 * Hace una llamada POST a la API con los datos de boardId, userId y role.
 * En caso de éxito invalida la cache 'tableros' para actualizar datos.
 */
export function useAsignarPermiso() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const { addToast } = useToasts();

  return useMutation<PermisoResponse, Error, PermisoInput>({
    mutationFn: async ({ boardId, userId, role }) => {
      const res = await fetchAuth(
        `${API_URL}/api/permisos/tablero/${boardId}/permisos`,
        {
          method: 'POST',
          body: JSON.stringify({ userId, role }),
        },
        logout,
        addToast
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Error al asignar permiso:", errorText);
        throw new Error(errorText || 'Error al asignar permiso');
      }

      return res.json();
    },

    onSuccess: () => {
      console.log("✅ Permiso asignado correctamente");
      queryClient.invalidateQueries({ queryKey: ['tableros'] });
    },

    onError: (error: Error) => {
      console.error("❌ Error en useAsignarPermiso:", error.message);
      if (addToast) addToast(`Error al asignar permiso: ${error.message}`, "error");
    },
  });
}
