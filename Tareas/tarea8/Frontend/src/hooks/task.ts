// 📦 Hooks para manejar tareas: cargar, agregar, borrar, buscar, etc.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types/task';
import { useConfigStore } from '../stores/configStore';
import { useUserSettings } from './userSettings';
import type { TaskFilter } from '../types';

// 🔐 Arma los headers con token si existe
function getAuthHeaders() {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// 🔄 Carga tareas de un tablero con paginación
const fetchTasks = async (tabId: string, page: number, limit: number) => {
  const url = `http://localhost:3000/api/boards/${tabId}/tasks?page=${page}&limit=${limit}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) throw new Error('No se pudieron obtener tareas');

  const data = await res.json();
  return data.items || data;
};

// 📥 Hook que obtiene tareas de un tablero
export function useTasks(tabId: string, page = 1, customLimit?: number) {
  const refetchInterval = useConfigStore(s => s.refetchInterval);
  const { data: userSettings } = useUserSettings();
  const limit = customLimit || userSettings?.itemsPerPage || 10;

  return useQuery<Task[]>({
    queryKey: ['tasks', tabId, page, limit],
    queryFn: () => fetchTasks(tabId, page, limit),
    initialData: [],
    refetchInterval,
  });
}

// ➕ Crear una nueva tarea
export function useAddTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ text, tabId }: { text: string; tabId: number }) => {
      const res = await fetch(`http://localhost:3000/api/boards/${tabId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ content: text, active: false }),
      });
      if (!res.ok) throw new Error('No se pudo crear la tarea');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// ❌ Borrar una tarea
export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId }: { taskId: string; tabId: string }) => {
      const res = await fetch(`http://localhost:3000/api/boards/${tabId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudo borrar la tarea');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// 🔁 Cambiar estado completado de una tarea
export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId, completed }: { taskId: string; tabId: string; completed: boolean }) => {
      const res = await fetch(`http://localhost:3000/api/boards/${tabId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ active: completed }),
      });
      if (!res.ok) throw new Error('Error al cambiar estado');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// ✏️ Editar el texto de una tarea
export function useEditTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, tabId, text }: { taskId: string; tabId: string; text: string }) => {
      const res = await fetch(`http://localhost:3000/api/boards/${tabId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) throw new Error('Error al editar tarea');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// 🧹 Eliminar todas las tareas completadas
export function useClearCompletedTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tabId: string) => {
      const res = await fetch(`http://localhost:3000/api/boards/${tabId}/tasks`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al limpiar completadas');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// 🔍 Buscar tareas por texto y filtro
export function useSearchTasks(tabId: string, searchTerm: string, filter: TaskFilter = 'all') {
  return useQuery<Task[]>({
    queryKey: ['search-tasks', tabId, searchTerm, filter],
    queryFn: async () => {
      if (!searchTerm.trim() || searchTerm.length < 2) return [];
      const params = new URLSearchParams({
        search: searchTerm,
        filter,
        page: '1',
        limit: '20',
      });
      const res = await fetch(`http://localhost:3000/api/boards/${tabId}/tasks?${params}`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('No se pudo buscar tareas');
      const result = await res.json();
      return result.items || result;
    },
    enabled: searchTerm.length >= 2,
  });
}
