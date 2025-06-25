import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../stores/notificationStore'

const BACKEND_URL = 'http://localhost:4321/api'

export function useEditTaskMutation(boardId: string, filter: string, page: number, limit: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, title }: { id: number; title: string }) => {
      const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          title,
          boardId
        }),
      })
      if (!res.ok) throw new Error('Error al editar la tarea')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
      useNotificationStore.getState().addNotification('Tarea editada', 'success')
    },
    onError: () => {
      useNotificationStore.getState().addNotification('Error al editar la tarea', 'error')
    },
  })
}