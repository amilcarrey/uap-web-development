import { useMutation } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import type { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTaskStore } from '../../store';
import { useToasts } from '../../components/Toast'; 
import { fetchAuth } from '../../utils/fetchAuth';

export function useToggleTask() {
  // Obtiene el id del tablero seleccionado desde Zustand
  const selectedTableroId = useTaskStore((state) => state.selectedTableroId);
  // Obtiene token y funciones del contexto Auth
  const { token, logout } = useAuth();
  // Función para actualizar tarea en el store
  const updateTask = useTaskStore((state) => state.updateTask);
  const { addToast } = useToasts();

  return useMutation<Task, Error, number>({
    mutationFn: async (taskId: number) => {
      if (!token) throw new Error("No autenticado");
      if (selectedTableroId === null) throw new Error("No hay tablero seleccionado");

      const res = await fetchAuth(
        `${API_URL}/api/tareas/toggle/${selectedTableroId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: taskId }),
        },
        logout,
        addToast
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Error al actualizar tarea");
      }

      const data = await res.json();
      return data as Task;
    },

    onSuccess: (updatedTask) => {
      updateTask(updatedTask);
    },
  });
}
