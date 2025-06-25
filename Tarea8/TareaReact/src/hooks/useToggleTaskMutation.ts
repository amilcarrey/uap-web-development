import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../stores/notificationStore'
import type { Task } from './useTasks'

const BACKEND_URL = 'http://localhost:4321/api'

export function useToggleTaskMutation(boardId: string, filter: string, page: number, limit: number) {
  const queryClient = useQueryClient()
  
  return useMutation({
    // Recibe el task completo para saber el estado actual
    mutationFn: async (task: Task) => {
      const res = await fetch(`${BACKEND_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          completed: !task.completed,
          boardId
        }),
      })

      if (!res.ok) {
        throw new Error('Error al cambiar el estado de la tarea')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
      useNotificationStore.getState().addNotification('Estado de tarea actualizado', 'success')
    },
    onError: () => {
      useNotificationStore.getState().addNotification('Error al actualizar el estado de la tarea', 'error')
    },
  })
}