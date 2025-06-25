import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../stores/notificationStore'

const BACKEND_URL = 'http://localhost:4321/api'

export function useClearCompletedMutation(boardId: string, filter: string, page: number, limit: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BACKEND_URL}/tasks/clear-completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ boardId }),
      })
      if (!res.ok) throw new Error('Error al borrar tareas completadas')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
      useNotificationStore.getState().addNotification('Tareas completadas borradas', 'success')
    },
    onError: () => {
      useNotificationStore.getState().addNotification('Error al borrar tareas completadas', 'error')
    },
  })
}