import axios from 'axios';
import { type Task } from '../types/types';

export const getTasks = async (boardId: number) => {
  const response = await axios.get(`http://localhost:3000/api/boards/${boardId}/tasks`, { withCredentials: true });
  return response.data.tasks as Task[];
};

export const createTask = async (boardId: number, data: { title: string; description?: string; status: 'pending' | 'in_progress' | 'done' }) => {
  const response = await axios.post(`http://localhost:3000/api/boards/${boardId}/tasks`, data, { withCredentials: true });
  return response.data.task as Task;
};