import { create } from 'zustand';

export type ToastType = {
  mensaje: string;
  tipo: 'exito' | 'error' | 'info';
};

interface ClientState {
  // Estado de notificaciones
  toast: ToastType | null;
  mostrarToast: (mensaje: string, tipo: ToastType['tipo']) => void;
  cerrarToast: () => void;
  
  // Paginación y filtros
  paginaActual: number;
  setPaginaActual: (pagina: number) => void;
  filtroActual: 'todas' | 'completadas' | 'pendientes';
  setFiltroActual: (filtro: 'todas' | 'completadas' | 'pendientes') => void;
}

export const useClientStore = create<ClientState>((set) => ({
  // Toast state
  toast: null,
  mostrarToast: (mensaje, tipo) => {
    set({ toast: { mensaje, tipo } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  cerrarToast: () => set({ toast: null }),
  
  // Pagination state
  paginaActual: 1,
  setPaginaActual: (pagina) => set({ paginaActual: pagina }),
  filtroActual: 'todas',
  setFiltroActual: (filtro) => set({ filtroActual: filtro, paginaActual: 1 }),
}));