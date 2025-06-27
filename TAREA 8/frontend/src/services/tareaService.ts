import api from './api';

export interface Tarea {
  id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  tableroId: string;
  creadoEn: string;
  actualizadoEn: string;
  completadoEn?: string;
}

export interface CrearTareaData {
  titulo: string;
  descripcion?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
}

export interface ActualizarTareaData {
  titulo?: string;
  descripcion?: string;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  completada?: boolean;
}

export interface FiltrosTareas {
  completada?: boolean;
  prioridad?: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  busqueda?: string;
  page?: number;
  limit?: number;
  ordenarPor?: 'creadoEn' | 'titulo' | 'prioridad' | 'completadoEn';
  orden?: 'asc' | 'desc';
}

export interface EstadisticasTablero {
  totalTareas: number;
  tareasCompletadas: number;
  tareasPendientes: number;
  porcentajeCompletado: number;
  prioridades: {
    URGENTE: number;
    ALTA: number;
    MEDIA: number;
    BAJA: number;
  };
}

export const tareaService = {
  obtenerTareas: async (tableroId: string, filtros?: FiltrosTareas): Promise<{ tareas: Tarea[]; total: number; page: number; totalPages: number }> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/tareas/tablero/${tableroId}?${params.toString()}`);
    return response.data as { tareas: Tarea[]; total: number; page: number; totalPages: number };
  },


  obtenerTarea: async (id: string): Promise<{ tarea: Tarea }> => {
    const response = await api.get(`/tareas/${id}`);
    return response.data as { tarea: Tarea };
  },


  crearTarea: async (tableroId: string, data: CrearTareaData): Promise<{ mensaje: string; tarea: Tarea }> => {
    const response = await api.post(`/tareas/tablero/${tableroId}`, data);
    return response.data as { mensaje: string; tarea: Tarea };
  },


  actualizarTarea: async (id: string, data: ActualizarTareaData): Promise<{ mensaje: string; tarea: Tarea }> => {
    const response = await api.put(`/tareas/${id}`, data);
    return response.data as { mensaje: string; tarea: Tarea };
  },


  eliminarTarea: async (id: string): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/tareas/${id}`);
    return response.data as { mensaje: string };
  },


  eliminarTareasCompletadas: async (tableroId: string): Promise<{ mensaje: string; tareasEliminadas: number }> => {
    const response = await api.delete(`/tareas/tablero/${tableroId}/completadas`);
    return response.data as { mensaje: string; tareasEliminadas: number };
  },


  completarVariasTareas: async (tableroId: string, tareasIds: string[]): Promise<{ mensaje: string; tareasCompletadas: number }> => {
    const response = await api.patch(`/tareas/tablero/${tableroId}/completar-varias`, { tareasIds });
    return response.data as { mensaje: string; tareasCompletadas: number };
  },


  obtenerEstadisticas: async (tableroId: string): Promise<{ estadisticas: EstadisticasTablero }> => {
    const response = await api.get(`/tareas/tablero/${tableroId}/estadisticas`);
    return response.data as { estadisticas: EstadisticasTablero };
  },
};
