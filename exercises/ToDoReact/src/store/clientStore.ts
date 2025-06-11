import { create } from "zustand";
import { devtools } from "zustand/middleware";

//RACES in NOTIFICATIONS xd
export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface EditingTask {
  id: string;
  text: string;
}

interface ClientState {
  //GENERAL STATES TO "SEE" THE PAGINATION AND FILTERS
  activeTab: string;
  filter: "all" | "active" | "completed";
  currentPage: number;
  itemsPerPage: number;
  editingTask: EditingTask | null;
  isAddingTab: boolean;

  notifications: Notification[];

  //ACTIONS PER TAB
  setActiveTab: (tab: string) => void;
  setFilter: (filter: "all" | "active" | "completed") => void;
  setCurrentPage: (page: number) => void;
  setEditingTask: (task: EditingTask | null) => void;
  setIsAddingTab: (isAdding: boolean) => void;
  resetPage: () => void;

  // Acciones para notificaciones
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useClientStore = create<ClientState>()(
  devtools(
    (set, get) => ({
      activeTab: "today",
      filter: "all",
      currentPage: 1,
      itemsPerPage: 5,
      editingTask: null,
      isAddingTab: false,
      notifications: [],

      setActiveTab: (tab) =>
        set({
          activeTab: tab,
          currentPage: 1,
        }),

      setFilter: (filter) =>
        set({
          filter,
          currentPage: 1,
        }),

      setCurrentPage: (page) => set({ currentPage: page }),
      setEditingTask: (task) => set({ editingTask: task }),
      setIsAddingTab: (isAdding) => set({ isAddingTab: isAdding }),
      resetPage: () => set({ currentPage: 1 }),

      addNotification: (notification) => {
        const id =
          Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
          ...notification,
          id,
          duration: notification.duration || 4000,
        };

        set({
          notifications: [...get().notifications, newNotification],
        });

        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id) =>
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        }),

      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: "client-store" }
  )
);

//PARTE QUE ME AYUDO LA IA PARA EL MANEJO DE NOTIFICACIONES CON INTERFACES AUXILIARES DEPENDIENDO EL TIPO DE NOTIFICACION QUE SE EJECUTA EN EL COMPONENTE Y RESPUESTA HTTP...
export const useNotifications = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useClientStore();

  const showSuccess = (title: string, message?: string, duration?: number) => {
    addNotification({ type: "success", title, message, duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    addNotification({ type: "error", title, message, duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    addNotification({ type: "info", title, message, duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    addNotification({ type: "warning", title, message, duration });
  };

  return {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
    clearNotifications,
  };
};
