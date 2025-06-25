import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  settings: {
    refetchInterval: 30,
    itemsPerPage: 10,
    uppercaseTasks: false
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

  // Cargar ajustes desde el servidor
  loadSettingsFromServer: async () => {
    try {
      const response = await fetch('http://localhost:3000/settings', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const settings = await response.json();
        set({ settings });
      } else {
        set({ 
          settings: {
            refetchInterval: 30,
            itemsPerPage: 10,
            uppercaseTasks: false
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings from server:', error);
      set({ 
        settings: {
          refetchInterval: 30,
          itemsPerPage: 10,
          uppercaseTasks: false
        }
      });
    }
  }
}));

export default useAppStore; 