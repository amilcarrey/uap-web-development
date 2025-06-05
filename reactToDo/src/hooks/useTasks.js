import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadTasks, saveTasks } from '../utils/storage';

export const useTasksByCategory = (category) => {
  return useQuery({
    queryKey: ['tasks', category],
    queryFn: async () => {
      // Simula un retardo de 2 segundos
      //await new Promise(res => setTimeout(res, 2000));
      // Simula un error descomentando la siguiente línea:
      // throw new Error('Error simulado para probar el estado de error');
      const allTasks = loadTasks();
      return allTasks.filter(task => task.category === category);
    },
    initialData: []
  });
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const addTask = useMutation({
    mutationFn: async ({ text, category }) => {
      const allTasks = loadTasks();
      const newTask = {
        id: Date.now(),
        text,
        category,
        completed: false
      };
      saveTasks([...allTasks, newTask]);
      return newTask;
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category]);
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
      queryClient.invalidateQueries(['tasks', category]);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async ({ id, category }) => {
      const tasks = loadTasks() || [];
      const filteredTasks = tasks.filter(task => task.id !== id);
      saveTasks(filteredTasks);
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries(['tasks', category]);
    },
  });

  const deleteCompletedTasks = useMutation({
    mutationFn: async (category) => {
      const tasks = loadTasks() || [];
      const filteredTasks = tasks.filter(
        task => !(task.category === category && task.completed)
      );
      saveTasks(filteredTasks);
    },
    onSuccess: (_, category) => {
      queryClient.invalidateQueries(['tasks', category]);
    },
  });

  return { addTask, toggleTask, deleteTask, deleteCompletedTasks };
};