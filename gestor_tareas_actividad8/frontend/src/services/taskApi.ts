// src/services/taskApi.ts
import api from './api';
import type { Task } from '../types/Task';

export const taskApi = {
  add: (text: string, boardId: string) =>
    api.post<Task>('/tasks', {
      text,
      completed: false,
      boardId
    }),

  delete: (id: string) =>
    api.delete(`/tasks/${id}`),

  deleteCompleted: (ids: string[]) =>
    Promise.all(ids.map(id =>
      api.delete(`/tasks/${id}`)
    )),
};
