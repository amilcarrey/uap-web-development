// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { Task } from '../types/Task';
import { toast } from '../utils/toasts';

// src/hooks/useTasks.ts
export const useTasks = (boardId: string, page: number, refetchInterval: number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks', boardId, page],
    queryFn: () => fetchTasks(boardId, page),
    refetchInterval,
    enabled: !!boardId,
  });

  const addTask = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask: Partial<Task>) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', boardId, page] });
      const previous = queryClient.getQueryData<{ tasks: Task[], total: number }>(['tasks', boardId, page]);

      if (previous) {
        queryClient.setQueryData(['tasks', boardId, page], {
          tasks: [
            {
              ...(newTask as Task), // You must ensure this cast is safe
              id: Date.now(),
              optimistic: true,
            },
            ...previous.tasks.slice(0, 4),
          ],
          total: previous.total + 1,
        });
      }

      return { previous };
    },
    onError: (_err, _newTask, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['tasks', boardId, page], context.previous);
      }
      toast('Error adding task', 'error');
    },
    onSuccess: () => toast('Task added!', 'success'),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] }),
  });

  const editTask = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onSuccess: () => {
      toast('Task updated!', 'success');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    },
  });

  const removeTask = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast('Task deleted!', 'success');
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId, page] });
    },
  });

  return { query, addTask, editTask, removeTask };
};
