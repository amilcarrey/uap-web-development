import api from './api';

export interface ConfiguracionSimple {
  intervaloActualizacion: number;
}

export const configuracionService = {
  obtenerConfiguracion: async (): Promise<ConfiguracionSimple> => {
    const response = await api.get('/configuracion');
    const config = (response.data as any).configuracion;
    
    return {
      intervaloActualizacion: config.intervaloActualizacion || 30
    };
  },

  actualizarConfiguracion: async (data: ConfiguracionSimple): Promise<{ mensaje: string }> => {
    const response = await api.put('/configuracion', {
      intervaloActualizacion: data.intervaloActualizacion,
    });
    return response.data as { mensaje: string };
  },

  resetearConfiguracion: async (): Promise<{ mensaje: string }> => {
    const response = await api.post('/configuracion/reset');
    return response.data as { mensaje: string };
  },
};
