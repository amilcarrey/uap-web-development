import api from './api';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  creadoEn: string;
  _count: {
    tableros: number;
    permisos: number;
  };
}

export interface Estadisticas {
  totalUsuarios: number;
  totalTableros: number;
  totalTareas: number;
  promedioTablerosPorUsuario: string;
  promedioTareasPorTablero: string;
}

export const adminService = {

  obtenerUsuarios: async (): Promise<{ usuarios: Usuario[] }> => {
    const response = await api.get('/admin/usuarios');
    return response.data as { usuarios: Usuario[] };
  },


  obtenerEstadisticas: async (): Promise<{ estadisticas: Estadisticas }> => {
    const response = await api.get('/admin/estadisticas');
    return response.data as { estadisticas: Estadisticas };
  },
};
