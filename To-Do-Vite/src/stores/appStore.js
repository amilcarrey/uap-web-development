import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  settings: {
    refetchInterval: 30,
    itemsPerPage: 5,
    theme: 'dark',
    language: 'es'
  },
  toasts: [],
  isLoading: false,
  error: null,

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },
  
  addToast: (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => get().removeToast(id), duration);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Persistencia de la configuración
  loadSettings: () => {
    try {
      const stored = localStorage.getItem('app-settings');
      if (stored) {
        set({ settings: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
  },
  
  saveSettings: () => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(get().settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }
}));

// Sincronizar cambios de settings con localStorage
useAppStore.subscribe(
  (state) => state.settings,
  () => useAppStore.getState().saveSettings()
);

// Cargar settings al inicio
if (typeof window !== 'undefined') {
  useAppStore.getState().loadSettings();
}

export default useAppStore; 