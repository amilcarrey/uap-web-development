import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../types/Task';


const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading, isError } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get<Task[]>(TASKS_ENDPOINT);
      return res.data;
    },
  });

  // Toggle completed
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      axios.patch(`${TASKS_ENDPOINT}/${id}`, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Delete task
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`${TASKS_ENDPOINT}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Clear completed
  const clearMutation = useMutation({
    mutationFn: async () => {
      const completedTasks = data.filter(task => task.completed);
      await Promise.all(
        completedTasks.map(task => axios.delete(`${TASKS_ENDPOINT}/${task.id}`))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    data,
    isLoading,
    isError,
    toggleTask: (id: number, completed: boolean) => toggleMutation.mutate({ id, completed }),
    deleteTask: (id: number) => deleteMutation.mutate(id),
    clearCompleted: () => clearMutation.mutate(),
  };
};
