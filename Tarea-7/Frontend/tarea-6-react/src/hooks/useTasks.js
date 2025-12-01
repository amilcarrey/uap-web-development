// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const fetchTasks = async (boardId) => {
  const res = await fetch(`/api/boards/${boardId}/tasks`);
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
};

const addTaskApi = async ({ boardId, text }) => {
  const res = await fetch(`/api/boards/${boardId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Error al agregar tarea');
  return res.json();
};

const toggleTaskApi = async ({ boardId, id, completed }) => {
  const res = await fetch(`/api/boards/${boardId}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.json();
};

const deleteTaskApi = async ({ boardId, id }) => {
  const res = await fetch(`/api/boards/${boardId}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return true;
};

const editTaskApi = async ({ boardId, id, text }) => {
  const res = await fetch(`/api/boards/${boardId}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Error al editar tarea');
  return res.json();
};

export function useTasks() {
  const queryClient = useQueryClient();
  const { boardId } = useParams();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => fetchTasks(boardId),
    enabled: !!boardId
  });

  const addTask = useMutation({
    mutationFn: ({ text }) => addTaskApi({ boardId, text }),
    onSuccess: () => {
      toast.success('Tarea agregada');
      queryClient.invalidateQueries(['tasks', boardId]);
    },
    onError: () => toast.error('Error al agregar tarea'),
  });

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => toggleTaskApi({ boardId, id, completed }),
    onSuccess: () => {
      toast.success('Tarea actualizada');
      queryClient.invalidateQueries(['tasks', boardId]);
    },
    onError: () => toast.error('Error al actualizar tarea'),
  });

  const deleteTask = useMutation({
    mutationFn: ({ id }) => deleteTaskApi({ boardId, id }),
    onSuccess: () => {
      toast.success('Tarea eliminada');
      queryClient.invalidateQueries(['tasks', boardId]);
    },
    onError: () => toast.error('Error al eliminar tarea'),
  });

  const editTask = useMutation({
    mutationFn: ({ id, text }) => editTaskApi({ boardId, id, text }),
    onSuccess: () => {
      toast.success('Tarea editada');
      queryClient.invalidateQueries(['tasks', boardId]);
    },
    onError: () => toast.error('Error al editar tarea'),
  });

  return {
    tasks, isLoading, error,
    addTask, toggleTask, deleteTask, editTask
  };
}
