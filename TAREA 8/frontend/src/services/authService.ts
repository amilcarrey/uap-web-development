import api from './api';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RegistroData {
  nombre: string;
  email: string;
  contraseña: string;
}

export interface LoginData {
  email: string;
  contraseña: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
  token: string;
}

export const authService = {
  registro: async (data: RegistroData): Promise<{ mensaje: string; usuario: Usuario; token?: string }> => {
    const response = await api.post('/auth/register', data);
    const registroResponse = response.data as { mensaje: string; usuario: Usuario; token?: string };
    
    return registroResponse;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    const loginResponse = response.data as LoginResponse;
    
    return loginResponse;
  },

  logout: async (): Promise<{ mensaje: string }> => {
    const response = await api.post('/auth/logout');
    return response.data as { mensaje: string };
  },

  obtenerPerfil: async (): Promise<{ usuario: Usuario }> => {
    const response = await api.get('/auth/perfil');
    return response.data as { usuario: Usuario };
  },
};
