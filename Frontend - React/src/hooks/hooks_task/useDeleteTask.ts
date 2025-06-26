import { useMutation } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { useAuth } from '../../context/AuthContext';
import { useTaskStore } from '../../store';
import { fetchAuth } from '../../utils/fetchAuth';

export function useDeleteTask() {
  const { token, logout } = useAuth();
  const selectedTableroId = useTaskStore((state) => state.selectedTableroId);
  const removeTask = useTaskStore((state) => state.removeTask); 

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error("No autenticado");
      if (selectedTableroId === null) throw new Error("No hay tablero seleccionado");

      const res = await fetchAuth(
        `${API_URL}/api/tareas/delete/${selectedTableroId}`,
        {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        },
        logout
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al eliminar tarea");
      }

      return id;
    },
    onSuccess: (deletedId) => {
      console.log("✅ Tarea eliminada con éxito:", deletedId);
      removeTask(deletedId);

    },
    onError: (error: Error) => {
      console.error("❌ Error al eliminar tarea:", error.message);
    },
  });
}
