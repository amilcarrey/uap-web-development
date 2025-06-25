// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const fetchTasks = async () => {
  const res = await fetch('/api/tasks');
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
};

const addTaskApi = async (text) => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Error al agregar tarea');
  return res.json();
};

const toggleTaskApi = async ({ id, completed }) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.json();
};

const deleteTaskApi = async (id) => {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return true;
};

const editTaskApi = async ({ id, text }) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Error al editar tarea');
  return res.json();
};

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  const addTask = useMutation({
    mutationFn: addTaskApi,
    onSuccess: () => {
      toast.success('Tarea agregada');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => toast.error('Error al agregar tarea'),
  });

  const toggleTask = useMutation({
    mutationFn: toggleTaskApi,
    onSuccess: () => {
      toast.success('Tarea actualizada');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => toast.error('Error al actualizar tarea'),
  });

  const deleteTask = useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      toast.success('Tarea eliminada');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => toast.error('Error al eliminar tarea'),
  });

  const editTask = useMutation({
    mutationFn: editTaskApi,
    onSuccess: () => {
      toast.success('Tarea editada');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: () => toast.error('Error al editar tarea'),
  });

  return {
    tasks, isLoading, error,
    addTask, toggleTask, deleteTask, editTask
  };
}
