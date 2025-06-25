import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useClientStore } from '../stores/clientStore';

export function useTasksByCategory({ category, boardId, page, pageSize, filter, search }) {
  return useQuery({
    queryKey: ['tasks', category, boardId, page, pageSize, filter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (boardId) params.append('boardId', boardId);
      if (page) params.append('page', page);
      if (pageSize) params.append('pageSize', pageSize);
      if (filter) params.append('filter', filter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/tasks?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al cargar tareas');
      return res.json();
    },
    keepPreviousData: true,
  });
}

export const useTaskMutations = (boardId) => {
  const queryClient = useQueryClient();

  const addTask = useMutation({
    mutationFn: async ({ text, category }) => {
      const res = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text, category, boardId }),
      });
      if (!res.ok) throw new Error('Error al crear tarea');
      return res.json();
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, boardId]);
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, text, category }) => {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text, category }),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      return res.json();
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, boardId]);
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed, category }) => {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      return res.json();
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, boardId]);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async ({ id, category }) => {
      const res = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al borrar tarea');
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, boardId]);
    },
  });

  const deleteCompletedTasks = useMutation({
    mutationFn: async ({ boardId, category }) => {
      const res = await fetch(`http://localhost:4000/api/tasks/clear-completed/${boardId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al borrar tareas completadas');
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, boardId]);
    },
  });

  return {
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    deleteCompletedTasks,
  };
};