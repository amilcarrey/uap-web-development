import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type Filtro = 'todas' | 'completas' | 'incompletas'

type Toast = { id: string; mensaje: string }

interface UIState {
  toasts: Toast[]
  addToast: (mensaje: string) => void
  dismissToast: (toast: Toast) => void

  filtro: Filtro
  setFiltro: (filtro: Filtro) => void

  // Configuraciones globales
  intervaloRefetch: number
  setIntervaloRefetch: (segundos: number) => void

  descripcionMayusculas: boolean
  setDescripcionMayusculas: (val: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  addToast: (mensaje) =>
    set((state) => ({ toasts: [...state.toasts, { id: nanoid(), mensaje }] })),
  dismissToast: (toast) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== toast.id) })),

  filtro: 'todas',
  setFiltro: (filtro) => set({ filtro }),

  intervaloRefetch: 10,
  setIntervaloRefetch: (segundos) => set({ intervaloRefetch: segundos }),

  descripcionMayusculas: false,
  setDescripcionMayusculas: (val) => set({ descripcionMayusculas: val }),
}))
