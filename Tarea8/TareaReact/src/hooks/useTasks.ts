export type Task = {
  id: number
  title: string
  completed: boolean
}

import { useQuery } from '@tanstack/react-query'

const BACKEND_URL = 'http://localhost:4321/api'


export type Filter = 'all' | 'active' | 'completed'

export type TasksResponse = {
  tasks: Task[]
  totalPages: number
  currentPage: number
}

export function useTasks(params: { boardId: string; filter: Filter; page: number; limit: number; refetchInterval?: number }) {
  const { boardId, filter, page, limit, refetchInterval } = params

  return useQuery<TasksResponse>({
    queryKey: ['tasks', filter, page, limit],
    queryFn: async () => {
      const res = await fetch(
        `${BACKEND_URL}/tasks?boardId=${boardId}&filter=${filter}&page=${page}&limit=${limit}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Error al cargar tareas')
      return res.json()
    },
    placeholderData: (previousData) => previousData,
    refetchInterval,
  })
}