// src/hooks/tasks.ts

/*
 Importamos los hooks principales de React Query:
 - useQuery: para leer datos del servidor.
 - useMutation: para enviar cambios al servidor (POST, PUT, DELETE).
 - useQueryClient: para interactuar con la "caché" de React Query.
*/
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../components/TaskItem';


/*
 Función que obtiene las tareas desde el backend según el ID de la pestaña actual (tabId).
 Se hace una petición GET al endpoint `/api/tasks?tabId=...`
 y se espera una respuesta JSON.
*/
const fetchTasks = async (tabId: string) => {
  const res = await fetch(`http://localhost:4321/api/tasks?tab=${tabId}`, {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
  return res.json(); // devuelve el array de tareas
};


/*
 Hook personalizado que usa useQuery para obtener las tareas.
 - queryKey: sirve para identificar en caché esta consulta en particular.
   Se usa un array con 'tasks' y el tabId, para que cada pestaña tenga su propia caché.
 - queryFn: es la función que se ejecuta para hacer la petición real.
*/
export function useTasks(tabId: string) {
  return useQuery<Task[]>({
    queryKey: ['tasks', tabId],
    queryFn: () => fetchTasks(tabId),
    initialData: [], // valor inicial si no hay datos aún
  });
}


/*
 Hook personalizado para agregar una nueva tarea usando useMutation.
 - mutationFn: define la lógica para enviar la tarea al backend (POST).
 - onSuccess: después de una creación exitosa, se invalida la consulta ['tasks']
   para que se vuelva a hacer el fetch y se actualice la lista automáticamente.
*/
export function useAddTask() {
  const queryClient = useQueryClient(); // permite interactuar con la caché

  return useMutation({
    mutationFn: async ({ text, tabId }: { text: string; tabId: string }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'add',
          text,
          tabId,
        }),
      });
      return res.json(); // devuelve la tarea agregada (opcionalmente)
    },
    // Esto se ejecuta si la mutación fue exitosa.
    // Invalidamos la query de tareas para que se recargue desde el servidor.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });

    },
  });
}

// Hook para eliminar una tarea
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId }: { taskId: string; tabId: string }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'delete',
          taskId,
          tabId,
        }),
      });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}

// Hook para alternar el estado completado de una tarea
export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId, completed }: { taskId: string; tabId: string; completed: boolean }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'toggle',
          taskId,
          tabId,
          //completed: String(completed),
        }),
      });
      if (!res.ok) throw new Error('Error al alternar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}

// Hook para editar el texto de una tarea
export function useEditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId, text }: { taskId: string; tabId: string; text: string }) => {
      const res = await fetch('http://localhost:4321/api/tasks', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: new URLSearchParams({
          action: 'edit',
          taskId,
          tabId,
          text,
        }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}
