import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../stores/notificationStore'

const BACKEND_URL = 'http://localhost:4321/api'

export function useAddTaskMutation(boardId: string, filter: string, page: number, limit: number, setNewTask: (v: string) => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(`${BACKEND_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          boardId
        }),
      })
      if (!res.ok) throw new Error('Error al agregar la tarea')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
      setNewTask('')
      useNotificationStore.getState().addNotification('Tarea agregada', 'success')
    },
    onError: () => {
      useNotificationStore.getState().addNotification('Error al agregar la tarea', 'error')
    },
  })
}