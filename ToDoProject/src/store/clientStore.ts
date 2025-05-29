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
  
  // Estado de dialogs/modales
  modalAgregarAbierto: boolean;
  modalEditarAbierto: boolean;
  tareaEditando: number | null;
  
  // Acciones para modales
  abrirModalAgregar: () => void;
  cerrarModalAgregar: () => void;
  abrirModalEditar: (id: number) => void;
  cerrarModalEditar: () => void;
  
  // Paginación local
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
  
  // Modal state
  modalAgregarAbierto: false,
  modalEditarAbierto: false,
  tareaEditando: null,
  
  // Modal actions
  abrirModalAgregar: () => set({ modalAgregarAbierto: true }),
  cerrarModalAgregar: () => set({ modalAgregarAbierto: false }),
  abrirModalEditar: (id) => set({ modalEditarAbierto: true, tareaEditando: id }),
  cerrarModalEditar: () => set({ modalEditarAbierto: false, tareaEditando: null }),
  
  // Pagination state
  paginaActual: 1,
  setPaginaActual: (pagina) => set({ paginaActual: pagina }),
  filtroActual: 'todas',
  setFiltroActual: (filtro) => set({ filtroActual: filtro, paginaActual: 1 }),
}));