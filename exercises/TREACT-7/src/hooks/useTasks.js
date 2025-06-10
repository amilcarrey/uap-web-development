// src/hooks/useTasks.js
import axios from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { TASKS_URL } from '../api/endpoints';
import { useSettings } from '../store/useStore';
import { toast } from 'react-toastify';

/**
 * useTasks: fetch de tareas con paginación y refetch automático
 */
export function useTasks(boardId, page = 1, limit = 5) {
  const { refetchInterval, uppercase } = useSettings();

  return useQuery({
    queryKey: ['tasks', boardId, page, limit, uppercase],
    queryFn: async () => {
      const url = TASKS_URL(boardId, page, limit);
      const { data } = await axios.get(url);
      if (uppercase) {
        data.data = data.data.map((t) => ({
          ...t,
          title: t.title.toUpperCase(),
        }));
      }
      return data; // { data: [...], page, totalPages, totalItems }
    },
    keepPreviousData: true,
    refetchInterval: refetchInterval, // milisegundos (o false)
    onError: (err) => {
      toast.error('Error al cargar tareas');
      console.error(err);
    },
  });
}

/**
 * Crear tarea en un tablero
 */
export function useCreateTask(boardId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title) => {
      // POST /boards/:boardId/tasks
      const url = TASKS_URL(boardId, 1, 1).split('?')[0];
      const { data } = await axios.post(url, {
        title,
        completed: false,
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Tarea creada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (err) => {
      toast.error('Error al crear tarea');
      console.error(err);
    },
  });
}

/**
 * Alternar completado
 */
export function useToggleTask(boardId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }) => {
      const url = `${TASKS_URL(boardId, 1, 1).split('?')[0]}/${id}`;
      const { data } = await axios.patch(url, {
        completed: !completed,
      });
      return data;
    },
    onSuccess: () => {
      toast.info('Tarea actualizada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (err) => {
      toast.error('Error al actualizar tarea');
      console.error(err);
    },
  });
}

/**
 * Eliminar tarea individual
 */
export function useDeleteTask(boardId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const url = `${TASKS_URL(boardId, 1, 1).split('?')[0]}/${id}`;
      await axios.delete(url);
      return id;
    },
    onSuccess: () => {
      toast.success('Tarea eliminada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (err) => {
      toast.error('Error al eliminar tarea');
      console.error(err);
    },
  });
}

/**
 * Eliminar todas las completadas
 */
export function useClearCompleted(boardId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const baseUrl = TASKS_URL(boardId, 1, 1).split('?')[0];
      await axios.delete(`${baseUrl}/completed`);
      return true;
    },
    onSuccess: () => {
      toast.info('Tareas completadas eliminadas');
      // Aquí invalidamos la query ['tasks', boardId] para que React Query vuelva
      // a ejecutar el GET /boards/:boardId/tasks?page=…&limit=… y actualice la lista
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (err) => {
      toast.error('Error al limpiar completadas');
      console.error(err);
    },
  });
}

/**
 * Editar el título de la tarea
 */
export function useEditTask(boardId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title }) => {
      const url = `${TASKS_URL(boardId, 1, 1).split('?')[0]}/${id}`;
      const { data } = await axios.patch(url, { title });
      return data;
    },
    onSuccess: () => {
      toast.success('Tarea editada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
    onError: (err) => {
      toast.error('Error al editar tarea');
      console.error(err);
    },
  });
}
