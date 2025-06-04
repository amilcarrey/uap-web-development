import { API_URL } from "../../components/TaskManager";
import type { Task } from "../../types";
import { useMutation, useQueryClient } from '@tanstack/react-query';

type EditarTareaPayload = {
  id: number;
  descripcion: string;
};

async function editarTarea(payload: EditarTareaPayload): Promise<Task> {
  const { id, descripcion } = payload;

  const response = await fetch(`${API_URL}/api/tareas/edit`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, descripcion }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al editar la tarea');
  }

  return response.json();
}

export function useEditarTarea() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, EditarTareaPayload>({
    mutationFn: editarTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      console.error('Error al editar la tarea:', error.message);
    },
  });
}

