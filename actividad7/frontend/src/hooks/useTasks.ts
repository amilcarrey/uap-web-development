import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import type { Task } from '../types/Task';

const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

type TasksResponse = {
  tasks: Task[];
  total: number;
};

export const useTasks = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError } = useQuery<TasksResponse, Error>({
    queryKey: ['tasks', page],
    queryFn: async () => {
      const res = await axios.get<Task[]>(`${TASKS_ENDPOINT}?_page=${page}&_limit=${limit}`);
      const total = parseInt(res.headers['x-total-count'] || '0', 10);

      return { tasks: res.data, total };
    },
    // keepPreviousData: true,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await axios.patch(`${TASKS_ENDPOINT}/${id}`, { completed });
      return res.data;
    },
    onSuccess: () => {
      toast.success('✅ Tarea actualizada');
      queryClient.invalidateQueries({ queryKey: ['tasks', page] });
    },
    onError: () => {
      toast.error('❌ Error al actualizar tarea');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`${TASKS_ENDPOINT}/${id}`),
    onSuccess: () => {
      toast.success('🗑️ Tarea eliminada');
      queryClient.invalidateQueries({ queryKey: ['tasks', page] });
    },
    onError: () => {
      toast.error('❌ No se pudo eliminar la tarea');
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!data) return;

      const completedTasks = data.tasks.filter(task => task.completed);
      await Promise.all(
        completedTasks.map(task =>
          axios.delete(`${TASKS_ENDPOINT}/${task.id}`).catch(err => {
            console.error(`Error deleting task ${task.id}`, err);
            throw err;
          })
        )
      );
    },
    onSuccess: () => {
      toast.success('🧹 Tareas completadas eliminadas');
      queryClient.invalidateQueries({ queryKey: ['tasks', page] });
    },
    onError: () => {
      toast.error('❌ No se pudieron eliminar las tareas completadas');
    },
  });

  // ✅ Actualizar tarea
const updateMutation = useMutation({
  mutationFn: async ({ id, text }: { id: string; text: string }) => {
    const response = await axios.patch(`${TASKS_ENDPOINT}/${id}`, { text });
    return response.data;
  },
  onSuccess: () => {
    toast.success('✏️ Tarea actualizada');
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
  onError: (error) => {
    console.error('❌ Error al editar tarea:', error);
    toast.error('❌ No se pudo editar la tarea');
  },
});

  return {
    tasks: data?.tasks || [],
    total: data?.total || 0,
    isLoading,
    isError,
    page,
    setPage,
    toggleTask: (id: string, completed: boolean) => toggleMutation.mutate({ id, completed }),
    deleteTask: (id: string) => deleteMutation.mutate(id),
    clearCompleted: () => {
      if (data?.tasks.some(task => task.completed)) {
        clearMutation.mutate();
      }
    },
    updateTask: (id: string, text: string) => updateMutation.mutate({ id, text }),
  };
};
