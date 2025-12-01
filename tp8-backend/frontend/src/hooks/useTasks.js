import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBoardsStore } from '../store/useBoardsStore';
import toast from 'react-hot-toast';

const fetchTasks = async (boardId) => {
  if (!boardId) throw new Error('No se especificó un tablero');
  const res = await fetch(`/api/tareas?tableroId=${boardId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json();
};

const addTaskApi = async ({ boardId, text }) => {
  if (!boardId) throw new Error('No se especificó un tablero para agregar la tarea');
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
    body: JSON.stringify({ completada: completed }), // Usamos `completada` booleano directamente
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
  const boardId = useBoardsStore((state) => state.current);
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => fetchTasks(boardId),
    enabled: !!boardId && Number.isFinite(Number(boardId)), // solo consulta si hay un boardId válido
  });

  const addTask = useMutation({
    mutationFn: ({ text }) => addTaskApi({ boardId, text }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', boardId]);
      toast.success('Tarea agregada');
    },
    onError: (err) => toast.error(err.message || 'No se pudo agregar la tarea'),
  });

  const toggleTask = useMutation({
    mutationFn: ({ id, completed }) => toggleTaskApi({ id, completed }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', boardId]),
    onError: (err) => toast.error(err.message || 'No se pudo actualizar tarea'),
  });

  const deleteTask = useMutation({
    mutationFn: ({ id }) => deleteTaskApi({ id }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', boardId]),
    onError: (err) => toast.error(err.message || 'No se pudo eliminar tarea'),
  });

  const editTask = useMutation({
    mutationFn: ({ id, text }) => editTaskApi({ id, text }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', boardId]),
    onError: (err) => toast.error(err.message || 'No se pudo editar tarea'),
  });

  return {
    boardId,
    tasks,
    isLoading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  };
};
