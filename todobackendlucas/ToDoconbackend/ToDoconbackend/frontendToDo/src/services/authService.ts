import api from '../api';
import type { User } from '../stores/authStore';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  usuario: User;
  token: string;
}

export const authAPI = {
  // Registro de usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/registrarse', data);
    return response.data;
  },

  // Login de usuario
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/logearse', data);
    return response.data;
  },

  // Verificar si el token es válido
  verifyToken: async (): Promise<User> => {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },
};
