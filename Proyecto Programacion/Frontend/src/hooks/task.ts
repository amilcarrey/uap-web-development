// src/hooks/tasks.ts

/*
 Importamos los hooks principales de React Query:
 - useQuery: para leer datos del servidor.
 - useMutation: para enviar cambios al servidor (POST, PUT, DELETE).
 - useQueryClient: para interactuar con la "caché" de React Query.
*/
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../components/TaskItem';
import { useConfigStore } from '../stores/configStore';
import type { TaskFilter } from '../types';

// Función helper para obtener headers de autenticación
function getAuthHeaders() {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Intentar obtener token de localStorage
  const storedToken = localStorage.getItem('authToken');
  if (storedToken) {
    headers['Authorization'] = `Bearer ${storedToken}`;
  }
  
  return headers;
}

/*
 Función que obtiene las tareas desde el backend según el ID de la pestaña actual (tabId).
 Se hace una petición GET al endpoint `/api/tasks?tabId=...`
 y se espera una respuesta JSON.
*/
const fetchTasks = async (tabId: string, _page: number, _limit: number) => {
  //console.log(`[Refetch] Solicitando tareas para ${tabId} a las ${new Date().toLocaleTimeString()}`);
  const res = await fetch(`/api/boards/${tabId}/tasks`, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  if (!res.ok) {
    console.log('Error al obtener tareas:', res.status);
    throw new Error('Error al obtener tareas');
  }
  const result = await res.json()
  //console.log(result);
  
  return result.items // devuelve el array de tareas
};

/*
 Hook personalizado que usa useQuery para obtener las tareas.
 - queryKey: sirve para identificar en caché esta consulta en particular.
   Se usa un array con 'tasks' y el tabId, para que cada pestaña tenga su propia caché.
 - queryFn: es la función que se ejecuta para hacer la petición real.
*/
export function useTasks(tabId: string, page: number = 1, limit: number = 5) { //Agrego valores por defecto en el caso de que al Hook no se le pase el page y limit
  const refetchInterval = useConfigStore(s => s.refetchInterval);

  return useQuery<Task[]>({
    queryKey: ['tasks', tabId, page, limit], // clave única para esta consulta
    queryFn: () => fetchTasks(tabId, page, limit), // función que obtiene las tareas
    initialData: [], // valor inicial si no hay datos aún
    refetchInterval, // intervalo para volver a hacer fetch automáticamente
  });
}

/*
 Hook personalizado para agregar una nueva tarea usando useMutation.
 - mutationFn: define la lógica para enviar la tarea al backend (POST).
 - onSuccess: después de una creación exitosa, se invalida la consulta ['tasks']
   para que se vuelva a hacer el fetch y se actualice la lista automáticamente.
*/
export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, tabId }: { text: string; tabId: number }) => {
      //console.log('=== INICIO useAddTask ===');
      //console.log('Datos enviados:', { text, tabId });
      //console.log('URL:', `http://localhost:3000/api/boards/${tabId}/tasks`);
      
      const requestBody = {
        content: text,
        active: false // Por defecto, la tarea no está completada
      };
      console.log('Body a enviar:', requestBody);
      
      const res = await fetch(`/api/boards/${tabId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
      
      if (!res.ok) {
        let errorMessage = 'Error al crear tarea';
        try {
          const errorData = await res.text();
          //console.log('Error del backend:', errorData);
          errorMessage = `Error ${res.status}: ${errorData}`;
        } catch (e) {
          console.log('No se pudo obtener el detalle del error');
        }
        throw new Error(errorMessage);
      }
      
      const result = await res.json();
      console.log('Tarea creada exitosamente:', result);
      return result;
    },
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
      const res = await fetch(`/api/boards/${tabId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
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
      const res = await fetch(`/api/boards/${tabId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          active: completed
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
      const res = await fetch(`/api/boards/${tabId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          content: text
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

// Hook para limpiar las tareas completadas
export function useClearCompletedTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tabId: string) => {
      console.log('Enviando petición clear-completed para tabId:', tabId);
      const res = await fetch(`/api/boards/${tabId}/tasks`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al limpiar tareas completadas');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false });
    },
  });
}

// Hook para búsqueda de tareas
export function useSearchTasks(tabId: string, searchTerm: string, filter: TaskFilter = 'all') {
  return useQuery<Task[]>({
    queryKey: ['search-tasks', tabId, searchTerm, filter],
    queryFn: async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) return [];
      
      const params = new URLSearchParams({
        search: searchTerm, // Usar 'search' en lugar de 'q' según la documentación
        filter: filter,
        page: '1',
        limit: '20', // Limitar resultados para mejor rendimiento
      });

      const res = await fetch(`/api/boards/${tabId}/tasks?${params}`, { // Usar el endpoint correcto
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Error al buscar tareas');
      
      const result = await res.json();
      return result.items || result; // Adaptar según estructura del backend
    },
    enabled: searchTerm.length >= 2, // Solo buscar si hay al menos 2 caracteres
  });
}
