import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  deleteCompletedTasks 
} from '../config/api';
import { useUserSettings } from './useSettings';
import useAppStore from '../stores/appStore';

export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (boardName, params = {}) => [...taskKeys.lists(), boardName, params],
  details: () => [...taskKeys.all, 'detail'],
  detail: (boardName, taskId) => [...taskKeys.details(), boardName, taskId],
};

export const useTasks = (boardName, params = {}) => {
  const { data: settings = {} } = useUserSettings();
  const refetchInterval = settings.refetch_interval || 30;

  return useQuery({
    queryKey: taskKeys.list(boardName, params),
    queryFn: () => fetchTasks(boardName, params),
    staleTime: refetchInterval * 1000, 
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchInterval: refetchInterval * 1000,
  });
};

export const useCreateTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ text }) => createTask(boardName, text),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tarea creada exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al crear la tarea', 'error');
      console.error('Error creating task:', error);
    },
  });
};

export const useUpdateTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ taskId, updates }) => updateTask(boardName, taskId, updates),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tarea actualizada exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al actualizar la tarea', 'error');
      console.error('Error updating task:', error);
    },
  });
};

export const useDeleteTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ taskId }) => deleteTask(boardName, taskId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tarea eliminada exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al eliminar la tarea', 'error');
      console.error('Error deleting task:', error);
    },
  });
};

export const useDeleteCompletedTasks = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: () => deleteCompletedTasks(boardName),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
      
      addToast('Tareas completadas eliminadas exitosamente', 'success');
    },
    onError: (error) => {
      addToast('Error al eliminar las tareas completadas', 'error');
      console.error('Error deleting completed tasks:', error);
    },
  });
};

export const useToggleTask = (boardName) => {
  const queryClient = useQueryClient();
  const { addToast } = useAppStore();

  return useMutation({
    mutationFn: ({ taskId, completed }) => updateTask(boardName, taskId, { completed }),
    onMutate: async ({ taskId, completed }) => {
      await queryClient.cancelQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });

      const previousQueries = queryClient.getQueriesData({ 
        queryKey: taskKeys.lists().concat(boardName)
      });

      queryClient.setQueriesData({ 
        queryKey: taskKeys.lists().concat(boardName)
      }, (oldData) => {
        if (!oldData || !oldData.tasks) return oldData;
        return {
          ...oldData,
          tasks: oldData.tasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
          )
        };
      });

      return { previousQueries };
    },
    onError: (err, variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      addToast('Error al actualizar la tarea', 'error');
      console.error('Error toggling task:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: taskKeys.lists().concat(boardName)
      });
    },
  });
}; 