import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const taskApi = {
  delete: (id: string) => axios.delete(`${API_BASE}/tasks/${id}`),
  deleteCompleted: (ids: string[]) => Promise.all(
    ids.map(id => axios.delete(`${API_BASE}/tasks/${id}`))
  ),
};