import api from '../api';

export interface Tablero {
  id: number;
  nombre: string;
  descripcion?: string;
  propietario_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreateTableroData {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTableroData {
  nombre?: string;
  descripcion?: string;
}

export interface Permiso {
  id: number;
  tablero_id: number;
  usuario_id: number;
  rol: 'propietario' | 'editor' | 'lector';
  fecha_asignacion: string;
  usuario_nombre?: string;
  usuario_email?: string;
}

export interface CompartirTableroData {
  email: string;
  rol: 'editor' | 'lector';
}

export const tablerosAPI = {
  // Obtener todos los tableros del usuario
  getTableros: async (): Promise<Tablero[]> => {
    const response = await api.get('/api/tableros');
    return response.data;
  },

  // Obtener un tablero específico
  getTablero: async (id: number): Promise<Tablero> => {
    const response = await api.get(`/api/tableros/${id}`);
    return response.data;
  },

  // Crear un nuevo tablero
  createTablero: async (data: CreateTableroData): Promise<Tablero> => {
    const response = await api.post('/api/tableros', data);
    return response.data;
  },

  // Actualizar un tablero
  updateTablero: async (id: number, data: UpdateTableroData): Promise<Tablero> => {
    const response = await api.put(`/api/tableros/${id}`, data);
    return response.data;
  },

  // Eliminar un tablero
  deleteTablero: async (id: number): Promise<void> => {
    await api.delete(`/api/tableros/${id}`);
  },

  // Obtener permisos de un tablero
  getPermisos: async (tableroId: number): Promise<Permiso[]> => {
    const response = await api.get(`/api/tableros/${tableroId}/permisos`);
    return response.data;
  },

  // Compartir tablero
  compartirTablero: async (tableroId: number, data: CompartirTableroData): Promise<Permiso> => {
    const response = await api.post(`/api/tableros/${tableroId}/compartir`, data);
    return response.data;
  },

  // Cambiar rol de usuario
  cambiarRol: async (tableroId: number, usuarioId: number, rol: string): Promise<Permiso> => {
    const response = await api.put(`/api/tableros/${tableroId}/usuarios/${usuarioId}/rol`, { rol });
    return response.data;
  },

  // Revocar acceso
  revocarAcceso: async (tableroId: number, usuarioId: number): Promise<void> => {
    await api.delete(`/api/tableros/${tableroId}/usuarios/${usuarioId}`);
  },
};
