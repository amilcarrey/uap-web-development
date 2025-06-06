// src/hooks/useTasks.js  (React Query v5)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = 'http://localhost:4000';

export function useTasks(boardId, { page = 1, limit = 10, refetchInterval = false } = {}) {
  return useQuery({
    queryKey: ['tasks', boardId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit });
      const res = await fetch(`${API_BASE}/boards/${boardId}/tasks?${params.toString()}`);
      if (!res.ok) throw new Error('Error al obtener tareas');
      return res.json(); // { tasks: [...], totalPages }
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval,       // false o milisegundos
    keepPreviousData: true,
  });
}

export function useAddTask(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTask) => {
      const res = await fetch(`${API_BASE}/boards/${boardId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error('Error al crear tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });
}

export function useUpdateTask(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await fetch(`${API_BASE}/boards/${boardId}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      return res.json();
    },
    onSuccess: (_, variables) => {
      // variables.id se podría usar si quisiéramos algo extra
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });
}

export function useDeleteTask(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE}/boards/${boardId}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar tarea');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });
}

export function useClearCompleted(boardId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_BASE}/boards/${boardId}/tasks/completed`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al limpiar completadas');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });
}
