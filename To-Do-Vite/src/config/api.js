const API_URL = 'http://localhost:3000';

// Configuración común para todas las peticiones
const getRequestConfig = (method = 'GET', body = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Incluir cookies para autenticación
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return config;
};

export const fetchBoards = async () => {
  const response = await fetch(`${API_URL}/boards`, getRequestConfig());
  if (!response.ok) throw new Error('Error al cargar los tableros');
  return response.json();
};

export const createBoard = async (name, category) => {
  const response = await fetch(`${API_URL}/boards`, getRequestConfig('POST', { name, category }));
  if (!response.ok) throw new Error('Error al crear el tablero');
  return response.json();
};

export const deleteBoard = async (name) => {
  const response = await fetch(`${API_URL}/boards/${name}`, getRequestConfig('DELETE'));
  if (!response.ok) throw new Error('Error al eliminar el tablero');
};

export const fetchTasks = async (boardName) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks`, getRequestConfig());
  if (!response.ok) throw new Error('Error al cargar las tareas');
  return response.json();
};

export const createTask = async (boardName, text) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks`, getRequestConfig('POST', { text }));
  if (!response.ok) throw new Error('Error al crear la tarea');
  return response.json();
};

export const updateTask = async (boardName, taskId, updates) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks/${taskId}`, getRequestConfig('PATCH', updates));
  if (!response.ok) throw new Error('Error al actualizar la tarea');
  return response.json();
};

export const deleteTask = async (boardName, taskId) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks/${taskId}`, getRequestConfig('DELETE'));
  if (!response.ok) throw new Error('Error al eliminar la tarea');
};

export const deleteCompletedTasks = async (boardName) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/tasks/completed`, getRequestConfig('DELETE'));
  if (!response.ok) throw new Error('Error al eliminar tareas completadas');
};

// Nuevas funciones para compartir tableros
export const shareBoard = async (boardName, username, role) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/share`, getRequestConfig('POST', { username, role }));
  if (!response.ok) throw new Error('Error al compartir el tablero');
  return response.json();
};

export const getBoardUsers = async (boardName) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/users`, getRequestConfig());
  if (!response.ok) throw new Error('Error al obtener usuarios del tablero');
  return response.json();
};

export const removeBoardUser = async (boardName, username) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/users/${username}`, getRequestConfig('DELETE'));
  if (!response.ok) throw new Error('Error al remover usuario del tablero');
};

// Funciones para enlaces compartidos
export const createShareLink = async (boardName, expiresInDays = 30) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/share-link`, getRequestConfig('POST', { expiresInDays }));
  if (!response.ok) throw new Error('Error al crear enlace compartido');
  return response.json();
};

export const revokeShareLink = async (boardName) => {
  const response = await fetch(`${API_URL}/boards/${boardName}/share-link`, getRequestConfig('DELETE'));
  if (!response.ok) throw new Error('Error al revocar enlace compartido');
};

export const getSharedBoard = async (token) => {
  const response = await fetch(`${API_URL}/shared/${token}`, getRequestConfig());
  if (!response.ok) throw new Error('Enlace no válido o expirado');
  return response.json();
};

export const getSharedBoardTasks = async (token) => {
  const response = await fetch(`${API_URL}/shared/${token}/tasks`, getRequestConfig());
  if (!response.ok) throw new Error('Error al cargar tareas del tablero compartido');
  return response.json();
};

// Funciones para el dashboard administrativo
export const getAdminStats = async () => {
  const response = await fetch(`${API_URL}/admin/stats`, getRequestConfig());
  if (!response.ok) throw new Error('Error al obtener estadísticas');
  return response.json();
};

export const getAdminUsers = async () => {
  const response = await fetch(`${API_URL}/admin/users`, getRequestConfig());
  if (!response.ok) throw new Error('Error al obtener usuarios');
  return response.json();
};

export const deleteAdminUser = async (userId) => {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, getRequestConfig('DELETE'));
  if (!response.ok) throw new Error('Error al eliminar usuario');
  return response.json();
}; 