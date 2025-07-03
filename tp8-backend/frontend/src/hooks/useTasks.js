// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBoardsStore } from '../store/useBoardsStore';
import toast from 'react-hot-toast';

const fetchTasks = async (boardId) => {
  const res = await fetch(`/api/tareas?tableroId=${boardId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
};

const addTaskApi = async ({ boardId, text }) => {
  const res = await fetch(`/api/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ contenido: text, tableroId: Number(boardId) }),
  });
  if (!res.ok) throw new Error('Error al agregar tarea');
  return res.json();
};

const toggleTaskApi = async ({ id, completed }) => {
  const res = await fetch(`/api/tareas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ estado: completed ? 'completada' : 'pendiente' }),
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.json();
};

const deleteTaskApi = async ({ id }) => {
  const res = await fetch(`/api/tareas/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return true;
};

const editTaskApi = async ({ id, text }) => {
  const res = await fetch(`/api/tareas/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ contenido: text }),
  });
  if (!res.ok) throw new Error('Error al editar tarea');
  return res.json();
};

export const useTasks = () => {
  const boardId = useBoardStore((state) => state.boardId);
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => fetchTasks(boardId),
    enabled: !!boardId,
  });

  const addTask = useMutation({
    mutationFn: (text) => addTaskApi({ boardId, text }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', boardId]);
      toast.success('Tarea agregada');
    },
    onError: () => toast.error('No se pudo agregar la tarea'),
  });

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => toggleTaskApi({ id, completed }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', boardId]),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => deleteTaskApi({ id }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', boardId]),
  });

  const editTask = useMutation({
    mutationFn: ({ id, text }) => editTaskApi({ id, text }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', boardId]),
  });

  return {
    tasks,
    isLoading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  };
};
