import { create } from 'zustand'

interface PaginationState {
  pagina: number
  porPagina: number
  setPagina: (pagina: number) => void
  setPorPagina: (cantidad: number) => void
}

export const usePaginationStore = create<PaginationState>((set) => ({
  pagina: 1,
  porPagina: 5,
  setPagina: (pagina) => set({ pagina }),
  setPorPagina: (cantidad) => set({ porPagina: cantidad }),
}))
