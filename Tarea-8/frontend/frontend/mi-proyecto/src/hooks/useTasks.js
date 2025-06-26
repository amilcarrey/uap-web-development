// src/hooks/useTasks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBoards, createBoard, deleteBoard,
  getTasks, addTask, toggleTaskCompletion, deleteTask, clearCompletedTasks, updateTask,
  getGlobalConfig, updateGlobalConfig,
} from '../api/tasks';

// --- Hooks para Tableros (Boards) ---
export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: getBoards,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// --- Hooks para Tareas ---
export const useTasks = (boardId, filter, page, limit) => {
  const { data: config } = useGlobalConfig();
  const refetchInterval = config?.refetch_interval;

  return useQuery({
    queryKey: ['tasks', boardId, filter, page, limit],
    queryFn: () => getTasks(boardId, filter, page, limit),
    enabled: !!boardId,
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    refetchIntervalInBackground: true,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, taskText }) => addTask(boardId, taskText),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, id }) => toggleTaskCompletion(boardId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, id }) => deleteTask(boardId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
  });
};

export const useClearCompletedTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId) => clearCompletedTasks(boardId),
    onSuccess: (_, boardId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, id, updatedTaskData }) =>
      updateTask(boardId, id, updatedTaskData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    },
  });
};

// --- Hooks para Configuración Global ---
export const useGlobalConfig = () => {
  return useQuery({
    queryKey: ['globalConfig'],
    queryFn: getGlobalConfig,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};

export const useUpdateGlobalConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGlobalConfig,
    onSuccess: (data) => {
      queryClient.setQueryData(['globalConfig'], data.config);
    },
    onError: (error) => {
      console.error('Error updating global config:', error);
    },
  });
};
