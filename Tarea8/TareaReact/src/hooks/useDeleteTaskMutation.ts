import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../stores/notificationStore'

const BACKEND_URL = 'http://localhost:4321/api'

export function useDeleteTaskMutation(boardId: string, filter: string, page: number, limit: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Error al eliminar la tarea')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
      useNotificationStore.getState().addNotification('Tarea eliminada', 'success')
    },
    onError: () => {
      useNotificationStore.getState().addNotification('Error al eliminar la tarea', 'error')
    },
  })
}