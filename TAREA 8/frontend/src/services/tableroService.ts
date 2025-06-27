import api from './api';

export interface Tablero {
  id: string;
  nombre: string;
  descripcion?: string;
  creadoPorId: number;
  creadoEn: string;
  actualizadoEn: string;
  rolUsuario: 'PROPIETARIO' | 'EDITOR' | 'LECTOR';
  _count?: {
    tareas: number;
  };
}

export interface CrearTableroData {
  nombre: string;
  descripcion?: string;
}

export interface CompartirTableroData {
  emailUsuario: string;
  rol: 'PROPIETARIO' | 'EDITOR' | 'LECTOR';
}

export const tableroService = {

  obtenerTableros: async (): Promise<{ tableros: Tablero[] }> => {
    const response = await api.get('/tableros');
    return response.data as { tableros: Tablero[] };
  },


  obtenerTablero: async (id: string): Promise<{ tablero: Tablero }> => {
    console.log('🔍 === DEBUGGING TABLERO SERVICE ===');
    console.log('🔍 tableroService.obtenerTablero llamado con ID:', id);
    console.log('🔍 Tipo del ID:', typeof id);
    console.log('🔍 Longitud del ID:', id.length);
    console.log('🔍 URL que se va a construir:', `/tableros/${id}`);
    console.log('🔍 ID caracteres individuales:', id.split(''));
    
    try {
      const response = await api.get(`/tableros/${id}`);
      console.log(' Respuesta recibida del backend:', response.data);
      return response.data as { tablero: Tablero };
    } catch (error: any) {
      console.error(' ERROR en tableroService.obtenerTablero:', error);
      console.error(' Error response:', error.response);
      console.error(' Error message:', error.message);
      console.error(' Error config:', error.config);
      throw error;
    }
  },


  crearTablero: async (data: CrearTableroData): Promise<{ mensaje: string; tablero: Tablero }> => {
    const response = await api.post('/tableros', data);
    return response.data as { mensaje: string; tablero: Tablero };
  },


  actualizarTablero: async (id: string, data: CrearTableroData): Promise<{ mensaje: string; tablero: Tablero }> => {
    const response = await api.put(`/tableros/${id}`, data);
    return response.data as { mensaje: string; tablero: Tablero };
  },


  eliminarTablero: async (id: string): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/tableros/${id}`);
    return response.data as { mensaje: string };
  },


  compartirTablero: async (id: string, data: CompartirTableroData): Promise<{ mensaje: string }> => {
    const response = await api.post(`/tableros/${id}/compartir`, data);
    return response.data as { mensaje: string };
  },


  eliminarPermiso: async (tableroId: string, usuarioId: number): Promise<{ mensaje: string }> => {
    const response = await api.delete(`/tableros/${tableroId}/permisos/${usuarioId}`);
    return response.data as { mensaje: string };
  },


  actualizarRolPermiso: async (tableroId: string, email: string, nuevoRol: 'EDITOR' | 'LECTOR'): Promise<{ mensaje: string }> => {
    const response = await api.post(`/tableros/${tableroId}/compartir`, {
      emailUsuario: email,
      rol: nuevoRol
    });
    return response.data as { mensaje: string };
  },
};
