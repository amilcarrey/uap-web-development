
import { create } from 'zustand';


const useNotificationStore = create((set) => ({
  message: null, 
  type: 'info',  
  isVisible: false, 
  timeoutId: null, 

  
  showNotification: (message, type = 'info', duration = 3000) => {
    set((state) => {
      
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }

      
      const newTimeoutId = setTimeout(() => {
        set({ isVisible: false, message: null });
      }, duration);

      return {
        message,
        type,
        isVisible: true,
        timeoutId: newTimeoutId,
      };
    });
  },

  
  hideNotification: () => {
    set((state) => {
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      return { isVisible: false, message: null, timeoutId: null };
    });
  },
}));

export default useNotificationStore;