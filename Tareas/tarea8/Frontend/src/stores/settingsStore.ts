// src/stores/settingsStore.ts
import { create } from 'zustand';

type SettingsState = {
  isOpen: boolean;
  activeTab: string | null;
  openSettings: (tab?: string) => void;
  closeSettings: () => void;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isOpen: false,
  // Inicializar activeTab con el valor de localStorage si existe
  activeTab: typeof window !== 'undefined' ? localStorage.getItem('settings-active-tab') : null,
  openSettings: (tab?: string) => {
    console.log('🔧 [SettingsStore] Abriendo configuraciones, tab:', tab);
    
    // Determinar qué tab usar
    let targetTab: string;
    
    if (tab) {
      // Se especificó un tab explícitamente
      targetTab = tab;
      localStorage.setItem('settings-active-tab', tab);
      console.log('🔧 [SettingsStore] Guardando tab en localStorage:', tab);
    } else {
      // No se especificó tab, usar el actual del store o localStorage o 'profile'
      const currentActiveTab = get().activeTab;
      const storedTab = localStorage.getItem('settings-active-tab');
      targetTab = currentActiveTab || storedTab || 'profile';
      console.log('🔧 [SettingsStore] Usando tab existente:', targetTab);
    }
    
    console.log('🔧 [SettingsStore] Tab activo será:', targetTab);
    set({ isOpen: true, activeTab: targetTab });
  },
  closeSettings: () => {
    console.log('🔧 [SettingsStore] Cerrando configuraciones');
    // NO resetear activeTab al cerrar, mantenerlo para futura apertura
    set({ isOpen: false });
  },
}));
