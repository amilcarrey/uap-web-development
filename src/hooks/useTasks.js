import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '../store/useUIStore'

export function useTasks(boardId, page, limit) {
  const refetchInterval = useUIStore(state => state.config.refetchInterval)

  return useQuery({
    queryKey: ['tasks', boardId, page],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/tasks?boardId=${boardId}&page=${page}&limit=${limit}`)
      if (!res.ok) throw new Error('Error cargando tareas')
      return res.json()
    },
    refetchInterval,
  })
}
