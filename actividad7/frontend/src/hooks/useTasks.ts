import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../types/Task';

const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

export const useTasks = () => {
  const queryClient = useQueryClient();

  const { data = [], isLoading, isError } = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const res = await axios.get<Task[]>(TASKS_ENDPOINT);
        return res.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
  });

  // Toggle completed - versión mejorada
  const toggleMutation = useMutation({
  mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
    await axios.patch(`${TASKS_ENDPOINT}/${id}`, { completed });
      try {
        const response = await axios.patch(`${TASKS_ENDPOINT}/${id}`, { completed });
        return response.data;
      } catch (error) {
        console.error('Error toggling task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  // Delete task - versión mejorada
  const deleteMutation = useMutation({
  mutationFn: async (id: number) => {
    await axios.delete(`${TASKS_ENDPOINT}/${id}`);
      try {
        await axios.delete(`${TASKS_ENDPOINT}/${id}`);
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Delete error:', error);
    }
  });

  // Clear completed - versión mejorada
  const clearMutation = useMutation({
    mutationFn: async () => {
      try {
        const completedTasks = data.filter(task => task.completed);
        if (completedTasks.length === 0) return;
        
        await Promise.all(
          completedTasks.map(task => 
            axios.delete(`${TASKS_ENDPOINT}/${task.id}`)
              .catch(error => {
                console.error(`Error deleting task ${task.id}:`, error);
                throw error;
              })
          )
        );
      } catch (error) {
        console.error('Error clearing completed tasks:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Clear completed error:', error);
    }
  });

  return {
    data,
    isLoading,
    isError,
    toggleTask: (id: number, completed: boolean) => {
      if (!id) {
        console.error('Invalid task id');
        return;
      }
      toggleMutation.mutate({ id, completed });
    },
    deleteTask: (id: number) => {
      if (!id) {
        console.error('Invalid task id');
        return;
      }
      deleteMutation.mutate(id);
    },
    clearCompleted: () => {
      if (data.some(task => task.completed)) {
        clearMutation.mutate();
      }
    },
  };
};