import api from '../api';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: 'baja' | 'media' | 'alta';
  fecha_limite?: string;
  tablero_id: number;
  creado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreateTareaData {
  titulo: string;
  descripcion?: string;
  prioridad?: 'baja' | 'media' | 'alta';
  fecha_limite?: string;
}

export interface UpdateTareaData {
  titulo?: string;
  descripcion?: string;
  completada?: boolean;
  prioridad?: 'baja' | 'media' | 'alta';
  fecha_limite?: string;
}

export const tareasAPI = {
  // Obtengo todas las tareas de un tablero
  getTareas: async (tableroId: number): Promise<Tarea[]> => {
    const response = await api.get(`/api/tableros/${tableroId}/tareas`);
    return response.data;
  },

  // Obtengo una tarea específica
  getTarea: async (tableroId: number, tareaId: number): Promise<Tarea> => {
    const response = await api.get(`/api/tableros/${tableroId}/tareas/${tareaId}`);
    return response.data;
  },

  // Creo una nueva tarea
  createTarea: async (tableroId: number, data: CreateTareaData): Promise<Tarea> => {
    const response = await api.post(`/api/tableros/${tableroId}/tareas`, data);
    return response.data;
  },

  // Actualizo una tarea
  updateTarea: async (tableroId: number, tareaId: number, data: UpdateTareaData): Promise<Tarea> => {
    const response = await api.put(`/api/tableros/${tableroId}/tareas/${tareaId}`, data);
    return response.data;
  },

  // Elimino una tarea
  deleteTarea: async (tableroId: number, tareaId: number): Promise<void> => {
    await api.delete(`/api/tableros/${tableroId}/tareas/${tareaId}`);
  },

  // Elimino todas las tareas completadas
  deleteTareasCompletas: async (tableroId: number): Promise<void> => {
    await api.delete(`/api/tableros/${tableroId}/tareas/completadas`);
  },
};
