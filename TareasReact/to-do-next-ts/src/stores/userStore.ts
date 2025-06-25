import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode'; // ✅ Import correcto con tipo

type Usuario = {
  id: string;
  nombre: string;
  email: string;
  token: string;
};

type EstadoUsuario = {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario) => void;
  limpiarUsuario: () => void;
};

// Intentar cargar token desde localStorage
let initialUsuario: Usuario | null = null;
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<{ id: string; nombre: string; email: string }>(token);
      initialUsuario = {
        id: decoded.id,
        nombre: decoded.nombre,
        email: decoded.email,
        token,
      };
    } catch (err) {
      console.error('Token inválido en localStorage');
    }
  }
}

export const useUserStore = create<EstadoUsuario>((set) => ({
  usuario: initialUsuario,
  setUsuario: (usuario) => set({ usuario }),
  limpiarUsuario: () => {
    localStorage.removeItem('token');
    set({ usuario: null });
  },
}));
