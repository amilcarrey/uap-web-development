import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import type { Task } from '../types/Task';

export function useTasks(boardId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/tasks`, {
          params: { boardId, page },
        });
        setTasks(res.data.tasks);
        setTotal(res.data.total);
        setIsError(false);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (boardId) fetchTasks();
  }, [boardId, page]);

  const toggleTask = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => prev - 1);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const clearCompleted = async () => {
    try {
      const completed = tasks.filter((t) => t.completed);
      await Promise.all(completed.map((t) => api.delete(`/tasks/${t.id}`)));
      setTasks((prev) => prev.filter((t) => !t.completed));
      setTotal((prev) => prev - completed.length);
    } catch {
      toast.error('Error al eliminar completadas');
    }
  };

  const updateTask = async (id: string, newText: string) => {
  try {
    await api.patch(`/tasks/${id}`, { text: newText });
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
    toast.success('✏️ Tarea actualizada');
  } catch {
    toast.error('Error al actualizar tarea');
  }
};

  return {
    tasks,
    total,
    isLoading,
    isError,
    page,
    setPage,
    toggleTask,
    deleteTask,
    clearCompleted,
    updateTask,
  };
}
