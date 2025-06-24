import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadTasks, saveTasks } from '../utils/storage';
import { useClientStore } from '../stores/clientStore';

export const useTasksByCategory = (category, boardId) => {
  return useQuery({
    queryKey: ['tasks', category, boardId],
    queryFn: async () => {
      const allTasks = loadTasks();
      return allTasks.filter(task =>
        task.category === category && task.boardId === boardId
      );
    },
    initialData: []
  });
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const { activeBoard } = useClientStore();

  const addTask = useMutation({
    mutationFn: async ({ text, category }) => {
      const allTasks = loadTasks();
      const newTask = {
        id: Date.now(),
        text,
        category,
        boardId: activeBoard,
        completed: false
      };
      saveTasks([...allTasks, newTask]);
      return newTask;
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, activeBoard]);
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed, category }) => {
      const tasks = loadTasks() || [];
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed } : task
      );
      saveTasks(updatedTasks);
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, activeBoard]);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async ({ id, category }) => {
      const tasks = loadTasks() || [];
      const filteredTasks = tasks.filter(task => task.id !== id);
      saveTasks(filteredTasks);
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, activeBoard]);
    },
  });

  const deleteCompletedTasks = useMutation({
    mutationFn: async ({ category }) => {
      const tasks = loadTasks() || [];
      const filteredTasks = tasks.filter(
        task => !(task.category === category && task.completed && task.boardId === activeBoard)
      );
      saveTasks(filteredTasks);
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, activeBoard]);
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, text, category }) => {
      const tasks = loadTasks() || [];
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, text } : task
      );
      saveTasks(updatedTasks);
      return { id, text, category };
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category, activeBoard]);
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    }
  });

  return {
    addTask,
    toggleTask,
    deleteTask,
    deleteCompletedTasks,
    updateTask
  };
};