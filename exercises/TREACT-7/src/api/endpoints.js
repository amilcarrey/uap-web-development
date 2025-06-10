// src/api/endpoints.js
export const API_BASE = 'http://localhost:4000';
export const BOARDS_URL = `${API_BASE}/boards`;
export const TASKS_URL = (boardId, page, limit) =>
  `${API_BASE}/boards/${boardId}/tasks?page=${page}&limit=${limit}`;
