import { create } from 'zustand'

type Notification = {
  id: number
  message: string
  type?: 'success' | 'error' | 'info'
}

type NotificationStore = {
  notifications: Notification[]
  addNotification: (message: string, type?: Notification['type']) => void
  removeNotification: (id: number) => void
}

let idCounter = 0

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (message, type = 'info') => {
    const id = ++idCounter
    set((state) => ({
      notifications: [...state.notifications, { id, message, type }]
    }))
    // Auto-remove after 3s
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }))
    }, 3000)
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
}))