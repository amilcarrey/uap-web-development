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
  currentUserId: null,

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },
  
  setCurrentUser: (userId) => {
    set({ currentUserId: userId });
    // Cargar configuraciones específicas del usuario
    if (userId) {
      get().loadSettings(userId);
    }
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

  // Persistencia de la configuración específica por usuario
  loadSettings: (userId) => {
    try {
      const stored = localStorage.getItem(`app-settings-${userId}`);
      if (stored) {
        set({ settings: JSON.parse(stored) });
      } else {
        // Configuración por defecto
        set({ 
          settings: {
            refetchInterval: 30,
            itemsPerPage: 5,
            theme: 'dark',
            language: 'es'
          }
        });
      }
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
  },
  
  saveSettings: () => {
    try {
      const { currentUserId, settings } = get();
      if (currentUserId) {
        localStorage.setItem(`app-settings-${currentUserId}`, JSON.stringify(settings));
      }
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

export default useAppStore; 