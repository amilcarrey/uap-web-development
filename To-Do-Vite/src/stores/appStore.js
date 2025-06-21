import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // Configuraciones de la aplicación
  settings: {
    refetchInterval: 30, // segundos
    itemsPerPage: 5,
    showCompletedTasks: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    theme: 'dark',
    language: 'es'
  },
  
  // Estado de toasts
  toasts: [],
  
  // Estado de UI
  isLoading: false,
  error: null,
  
  // Acciones para configuraciones
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },
  
  resetSettings: () => {
    set((state) => ({
      settings: {
        refetchInterval: 30,
        itemsPerPage: 5,
        showCompletedTasks: true,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        theme: 'dark',
        language: 'es'
      }
    }));
  },
  
  // Acciones para toasts
  addToast: (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
    
    // Auto-remove toast after duration
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },
  
  clearToasts: () => {
    set({ toasts: [] });
  },
  
  // Acciones para UI
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  setError: (error) => {
    set({ error });
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  // Utilidades
  getSetting: (key) => {
    return get().settings[key];
  },
  
  // Persistencia en localStorage
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem('app-settings');
      if (stored) {
        const settings = JSON.parse(stored);
        set({ settings });
      }
    } catch (error) {
      console.error('Error loading settings from storage:', error);
    }
  },
  
  saveToStorage: () => {
    try {
      const { settings } = get();
      localStorage.setItem('app-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to storage:', error);
    }
  }
}));

// Auto-save settings when they change
useAppStore.subscribe(
  (state) => state.settings,
  (settings) => {
    useAppStore.getState().saveToStorage();
  }
);

// Load settings on initialization
if (typeof window !== 'undefined') {
  useAppStore.getState().loadFromStorage();
}

export default useAppStore; 