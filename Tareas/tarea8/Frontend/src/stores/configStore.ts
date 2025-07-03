//src\stores\configStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState{
  refetchInterval: number;
  setRefetchInterval: (interval: number) => void;
  upperCaseDescription: boolean;
  setUpperCaseDescription: (value: boolean) => void;
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      refetchInterval: 10000, // Intervalo de refetch por defecto (10 segundos)
      setRefetchInterval: (interval) => {
        const { userId } = get();
        if (userId) {
          // Guardar configuración específica del usuario
          localStorage.setItem(`user_${userId}_refetchInterval`, interval.toString());
        }
        set({ refetchInterval: interval });
      },
      upperCaseDescription: false, // Por defecto no se usa mayúsculas en la descripción
      setUpperCaseDescription: (value) => {
        const { userId } = get();
        if (userId) {
          // Guardar configuración específica del usuario
          localStorage.setItem(`user_${userId}_upperCaseDescription`, value.toString());
        }
        set({ upperCaseDescription: value });
      },
      userId: null,
      setUserId: (newUserId) => {
        // Al cambiar de usuario, cargar sus configuraciones específicas
        if (newUserId) {
          const savedRefetchInterval = localStorage.getItem(`user_${newUserId}_refetchInterval`);
          const savedUpperCase = localStorage.getItem(`user_${newUserId}_upperCaseDescription`);
          
          set({
            userId: newUserId,
            refetchInterval: savedRefetchInterval ? parseInt(savedRefetchInterval) : 10000,
            upperCaseDescription: savedUpperCase ? savedUpperCase === 'true' : false
          });
        } else {
          // Si no hay usuario, resetear a valores por defecto
          set({
            userId: null,
            refetchInterval: 10000,
            upperCaseDescription: false
          });
        }
      },
    }),
    {
      name: 'config-storage', // nombre de la key en localStorage
      // Solo persistir configuraciones básicas, no el userId
      partialize: (state) => ({ 
        refetchInterval: state.refetchInterval,
        upperCaseDescription: state.upperCaseDescription 
      }),
    }
  )
);