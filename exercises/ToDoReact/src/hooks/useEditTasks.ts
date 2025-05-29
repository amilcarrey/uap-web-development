import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { toast } from 'react-hot-toast'; 
import type { Task } from '../lib/tasks'; // Importa el tipo Task desde donde lo tengas definido

const API_URL = import.meta.env.VITE_API_URL;

export function useEditTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) => {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ _method: 'EDIT_TASK', id, text }),
      });
      if (!res.ok) throw new Error('Error al editar la tarea');
      return res.json(); 
    },
    onMutate: async (newTask: { id: number; text: string }) => {
      //Se ejecuta antes de que empiece mutationFn. Es lo primero que corre cuando se llama a mutate().
      // Snapshot del estado anterior 
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      // Actualización optimista actualizás la UI inmediatamente como si la operación
      // ya hubiera salido bien, antes de que el servidor confirme el cambio.
      //Riesgo: puede fallar, por eso se guarda un snapshot (previousTasks) y se puede deshacer (onError).
      queryClient.setQueryData<Task[]>(['tasks'], (old) => 
        old?.map(task => 
          task.id === newTask.id ? { ...task, text: newTask.text } : task
        )
      );
      
      return { previousTasks };
    },
    onError: (error: Error, newTask, context) => { 
      // Revertir en caso de error Si el servidor falla, se revierte la UI al estado anterior con previousTasks.
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], context.previousTasks);
      }
      
    },
    onSettled: () => {
      // Invalidar y re-fetchear Se usa para asegurarse de que lo que hay en cache esté 100% sincronizado con el servidor.
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); 
    }
  });
}