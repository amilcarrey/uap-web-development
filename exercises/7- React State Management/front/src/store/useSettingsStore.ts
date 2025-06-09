import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    refetchInterval: number;
    upperCaseDescription: boolean;
    paginationLimit: number;
    setRefetchInterval: (interval: number) => void;
    setUpperCaseDescription: (value: boolean) => void;
    setPaginationLimit: (limit: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            refetchInterval: 10000, // 10 seconds default
            upperCaseDescription: false,
            paginationLimit: 5,
            setRefetchInterval: (interval) => set({ refetchInterval: interval }),
            setUpperCaseDescription: (value) => set({ upperCaseDescription: value }),
            setPaginationLimit: (limit) => set({ paginationLimit: limit }),
        }),
        {
            name: 'settings-storage',
        }
    )
);