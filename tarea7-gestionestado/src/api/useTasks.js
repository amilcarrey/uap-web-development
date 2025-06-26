import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import useConfigStore from '../store/configStore'

// Obtener tareas por boardId y página
export function useTasks(boardId, page = 1, limit = 5) {
  const refetchInterval = useConfigStore((s) => s.refetchInterval)

  return useQuery({
    queryKey: ['tasks', boardId, page],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/tasks`, {
        params: {
          boardId,
          _page: page,
          _limit: limit,
          _sort: 'id',
          _order: 'desc',
        },
      })
      return {
        data: res.data,
        total: parseInt(res.headers['x-total-count'] || 0),
      }
    },
    refetchInterval,
    keepPreviousData: true,
  })
}

// Agregar tarea
export function useAddTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task) =>
      axios.post('http://localhost:3000/tasks', task).then((res) => res.data),
    onSuccess: (_data, _variables, context) => {
      toast.success('Tarea agregada')
      queryClient.invalidateQueries(['tasks', context.boardId])
    },
    onError: () => toast.error('Error al agregar tarea'),
  })
}

// Eliminar tarea
export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (task) =>
      axios.delete(`http://localhost:3000/tasks/${task.id}`),
    onSuccess: (_, deletedTask) => {
      toast.success('Tarea eliminada')
      queryClient.invalidateQueries(['tasks', deletedTask.boardId])
    },
    onError: () => toast.error('Error al eliminar tarea'),
  })
}

// Editar tarea
export function useEditTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedTask) =>
      axios.patch(
        `http://localhost:3000/tasks/${updatedTask.id}`,
        updatedTask
      ),
    onSuccess: (_, updatedTask) => {
      toast.success('Tarea actualizada')
      queryClient.invalidateQueries(['tasks', updatedTask.boardId])
    },
    onError: () => toast.error('Error al editar tarea'),
  })
}

// Toggle completado
export function useToggleTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (task) =>
      axios.patch(`http://localhost:3000/tasks/${task.id}`, {
        completed: !task.completed,
      }),
    onSuccess: (_, task) => {
      queryClient.invalidateQueries(['tasks', task.boardId])
    },
    onError: () => toast.error('Error al actualizar estado'),
  })
}
