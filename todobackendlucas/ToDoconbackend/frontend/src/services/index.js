import api from '../lib/api';

// Servicios de autenticación
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/logearse', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/registrarse', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  saveAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Servicios de tableros
export const boardService = {
  async getBoards() {
    const response = await api.get('/tableros');
    return response.data;
  },

  async getBoard(id) {
    const response = await api.get(`/tableros/${id}`);
    return response.data;
  },

  async createBoard(boardData) {
    const response = await api.post('/tableros', boardData);
    return response.data;
  },

  async updateBoard(id, boardData) {
    const response = await api.put(`/tableros/${id}`, boardData);
    return response.data;
  },

  async deleteBoard(id) {
    const response = await api.delete(`/tableros/${id}`);
    return response.data;
  },

  // Servicios de permisos
  async getBoardPermissions(boardId) {
    const response = await api.get(`/tableros/${boardId}/permisos`);
    return response.data;
  },

  async shareBoard(boardId, shareData) {
    const response = await api.post(`/tableros/${boardId}/compartir`, shareData);
    return response.data;
  },

  async changeUserRole(boardId, userId, roleData) {
    const response = await api.put(`/tableros/${boardId}/usuarios/${userId}/rol`, roleData);
    return response.data;
  },

  async revokeAccess(boardId, userId) {
    const response = await api.delete(`/tableros/${boardId}/usuarios/${userId}`);
    return response.data;
  }
};

// Servicios de tareas
export const taskService = {
  async getTasks(boardId) {
    const response = await api.get(`/tableros/${boardId}/tareas`);
    return response.data;
  },

  async getTask(boardId, taskId) {
    const response = await api.get(`/tableros/${boardId}/tareas/${taskId}`);
    return response.data;
  },

  async createTask(boardId, taskData) {
    const response = await api.post(`/tableros/${boardId}/tareas`, taskData);
    return response.data;
  },

  async updateTask(boardId, taskId, taskData) {
    const response = await api.put(`/tableros/${boardId}/tareas/${taskId}`, taskData);
    return response.data;
  },

  async deleteTask(boardId, taskId) {
    const response = await api.delete(`/tableros/${boardId}/tareas/${taskId}`);
    return response.data;
  },

  async deleteCompletedTasks(boardId) {
    const response = await api.delete(`/tableros/${boardId}/tareas/completadas`);
    return response.data;
  }
};

// Servicios de usuarios
export const userService = {
  async getUsers() {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async getUser(id) {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async createUser(userData) {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  async updateUser(id, userData) {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  async deleteUser(id) {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  }
};
