import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../components/Toast'; 
import type { Task } from '../../types';
import { useTaskStore } from '../../store';
import { fetchAuth } from '../../utils/fetchAuth';

// Tipo para el payload al crear una tarea
type NuevaTareaPayload = {
  descripcion: string;
  tableroId: number;
};

export function useAddTask(): UseMutationResult<Task, Error, NuevaTareaPayload> {
  const { token, logout } = useAuth();
  const { addToast } = useToasts(); 
  const addTask = useTaskStore((state) => state.addTask); 

  return useMutation({
    mutationFn: async ({ descripcion, tableroId }) => {
      if (!token) throw new Error('No autenticado');

      const res = await fetchAuth(
        `${API_URL}/api/tareas/add/${tableroId}`,
        {
          method: 'POST',
          body: JSON.stringify({ descripcion }),
        },
        logout,
        addToast
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'No se pudo crear la tarea');
      }

      const data = await res.json();
      return data.task as Task;
    },

    // Acción a ejecutar al tener éxito en la mutación
    onSuccess: (newTask) => {
      console.log("✅ Tarea agregada con éxito:", newTask);
      addTask(newTask); // Actualiza el estado global/local con la nueva tarea
    },
  });
}
