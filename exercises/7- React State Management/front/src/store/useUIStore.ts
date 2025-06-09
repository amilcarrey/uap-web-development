import { create } from "zustand";
import { useSettingsStore } from './useSettingsStore';

export type Filter = 'all' | 'activa' | 'completada';

interface UIState {
    filter: Filter;
    offset: number;
    limit: number;
    // Añadido: Paginación
    setFilter:(filter: Filter) => void;
    setOffset: (offset: number) => void;
    setLimit: (limit: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
    filter: 'all',
    offset: 0,
    limit: useSettingsStore.getState().paginationLimit, // Usar límite de configuraciones
    setFilter: (filter) => set({filter}),
    setOffset: (offset) => set({offset}),
    setLimit: (limit) => set({limit}),
}));

// Suscribirse a cambios en las configuraciones
useSettingsStore.subscribe((state, prevState) => {
    if (state.paginationLimit !== prevState.paginationLimit) {
        useUIStore.setState({ limit: state.paginationLimit });
    }
});