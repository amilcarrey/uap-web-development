import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Tarea } from '../types/tarea'
import { useUIStore } from '../store/UIStore'

const API_URL = '/api/tareas'

export function useObtenerTareas(tableroId: string, page: number, limit: number) {
  const intervaloRefetch = useUIStore(state => state.intervaloRefetch)

  return useQuery<{ tareas: Tarea[]; total: number }, Error>({
    queryKey: ['tareas', tableroId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        tableroId,
        page: page.toString(),
        limit: limit.toString(),
      })
      const res = await fetch(`${API_URL}?${params.toString()}`)
      if (!res.ok) throw new Error('Error al cargar tareas')
      return res.json() as Promise<{ tareas: Tarea[]; total: number }>
    },
    refetchInterval: intervaloRefetch * 1000,
  })
}

export function useAgregarTarea(tableroId: string) {
  const queryClient = useQueryClient()
  return useMutation<Tarea, Error, Omit<Tarea, 'id'>>(
    async (nueva) => {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Error al agregar tarea')
      }
      return res.json() as Promise<Tarea>
    },
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] }),
      onError: (error: Error) => {
        console.error(error)
      },
    }
  )
}

export function useActualizarTarea(tableroId: string) {
  const queryClient = useQueryClient()
  return useMutation<Tarea, Error, Tarea>(
    async (tarea) => {
      const res = await fetch(`${API_URL}/${tarea.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea),
      })
      if (!res.ok) throw new Error('Error al actualizar tarea')
      return res.json() as Promise<Tarea>
    },
    {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] }),
      onError: (error: Error) => {
        console.error(error)
      },
    }
  )
}

export function useEliminarTarea(tableroId: string) {
  const queryClient = useQueryClient()
  return useMutation<number, Error, number>(
    async (id) => {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar tarea')
      return id
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['tareas', tableroId]),
      onError: (error: Error) => {
        console.error(error)
      },
    }
  )
}



