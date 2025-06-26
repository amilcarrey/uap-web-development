import { useMutation } from '@tanstack/react-query';
import { API_URL } from "../../components/TaskManager";
import type { Task } from "../../types";
import { useAuth } from '../../context/AuthContext';
import { useTaskStore } from '../../store';
import { useToasts } from '../../components/Toast'; 
import { fetchAuth } from '../../utils/fetchAuth';

type EditarTareaPayload = {
  id: number;
  descripcion: string;
};

async function editarTarea(payload: EditarTareaPayload, boardId: number, logout: () => void, addToast: (msg: string, type?: "error" | "success" | "info") => void): Promise<Task> {
  const response = await fetchAuth(
    `${API_URL}/api/tareas/edit/${boardId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    logout,
    addToast
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al editar la tarea');
  }

  return response.json(); 
}

export function useEditarTarea() {
  const { token, logout } = useAuth();
  const selectedTableroId = useTaskStore((state) => state.selectedTableroId);
  const updateTask = useTaskStore((state) => state.updateTask);
  const { addToast } = useToasts();

  return useMutation({
    mutationFn: async (payload: EditarTareaPayload) => {
      if (!token) throw new Error("No autenticado");
      if (selectedTableroId === null) throw new Error("No hay tablero seleccionado");

      // Ejecuta la función para editar la tarea
      return await editarTarea(payload, selectedTableroId, logout, addToast);
    },

    // Actualiza el estado global con la tarea editada
    onSuccess: (tareaEditada) => {
      updateTask(tareaEditada);
    },

    onError: (error: Error) => {
      console.error("❌ Error al editar tarea:", error.message);
    },
  });
}
