import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Task } from '../types/Task';

const TASKS_ENDPOINT = 'http://localhost:3000/tasks';

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      axios.post<Task>(TASKS_ENDPOINT, {
        text,
        completed: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
