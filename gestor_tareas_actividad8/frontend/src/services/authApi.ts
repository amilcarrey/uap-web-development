import api from './api';

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token); // ✅ guarda el token
    return res;
  },

  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),

  logout: () => {
    localStorage.removeItem('token'); // ✅ elimina el token
  }
};
