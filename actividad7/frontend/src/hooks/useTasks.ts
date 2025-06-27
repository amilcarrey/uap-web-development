import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
//import { useParams } from 'react-router-dom';
import type { Task } from '../types/Task';
import { useSettings } from '../context/SettingsContext'; // 👈 Agrega esto


const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

type TasksResponse = {
  tasks: Task[];
  total: number;
};

export const useTasks = (boardId: string) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { refetchInterval } = useSettings();
  const limit = 5;

  const { data, isLoading, isError } = useQuery<TasksResponse, Error>({
    queryKey: ['tasks', boardId, page],
    queryFn: async () => {
      const res = await axios.get<Task[]>(
        `${TASKS_ENDPOINT}?boardId=${boardId}&_page=${page}&_limit=${limit}`
      );
      const total = parseInt(res.headers['x-total-count'] || '0', 10);
      return { tasks: res.data, total };
    },
    refetchInterval,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await axios.patch(`${TASKS_ENDPOINT}/${id}`, { completed });
      return res.data;
    },
    onSuccess: () => {
      toast.success('✅ Tarea actualizada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`${TASKS_ENDPOINT}/${id}`),
    onSuccess: () => {
      toast.success('🗑️ Tarea eliminada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!data) return;
      const completedTasks = data.tasks.filter(task => task.completed);
      await Promise.all(
        completedTasks.map(task =>
          axios.delete(`${TASKS_ENDPOINT}/${task.id}`)
        )
      );
    },
    onSuccess: () => {
      toast.success('🧹 Tareas completadas eliminadas');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const response = await axios.patch(`${TASKS_ENDPOINT}/${id}`, { text });
      return response.data;
    },
    onSuccess: () => {
      toast.success('✏️ Tarea editada');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
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
