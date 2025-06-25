import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useConfigStore } from '@/stores/configStore'
import { API } from '@/lib/api'

// hook para traer tareas según filtro, página y tablero
export const useTareas = (
  filtro: string,
  pagina: number,
  tableroId: string | null,
  busqueda: string = ''
) => {

  const refetchInterval = useConfigStore((state) => state.refetchInterval)
  const tareasPorPagina = useConfigStore((state) => state.tareasPorPagina)

    return useQuery({
    queryKey: ['tareas', filtro, pagina, tableroId, tareasPorPagina, busqueda],
    queryFn: async () => {
      const res = await fetch(
        `${API}/api/tareas?filtro=${filtro}&pagina=${pagina}&limit=${tareasPorPagina}&tableroId=${tableroId}&busqueda=${encodeURIComponent(busqueda)}`,
        { credentials: 'include' }
      )


      if (!res.ok) throw new Error('Error al cargar tareas')

      const json = await res.json()
      // paso completada a boolean por si viene como 0/1
      const tareas = json.tareas.map((t: any) => ({
        ...t,
        completada: Boolean(t.completada),
      }))
      return { ...json, tareas }
    },
    enabled: !!tableroId, // solo si hay tablero
    refetchInterval,
  })
}

// para agregar tarea nueva
export const useAgregarTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (texto: string) => {
      if (!tableroId) throw new Error('Falta tableroId')

      const res = await fetch(`${API}/api/tareas`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, tableroId }),
      })

      if (!res.ok) throw new Error('Error al agregar tarea')
      return res.json()
    },
    onSuccess: () => {
      // refresco tareas después de agregar
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      })
    },
  })
}

// para alternar completada/no completada
export const useToggleTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API}/api/tareas/${id}/toggle`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Error al actualizar tarea')
      return res.json()
    },
    onSuccess: () => {
      // refresco tareas después de toggle
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      })
    },
  })
}

// para borrar tarea
export function useBorrarTarea(filtro: string, pagina: number, tableroId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API}/api/tareas/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Error al borrar')
    },
    onSuccess: () => {
      // refresco tareas después de borrar
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      })
    },
  })
}

// para limpiar tareas completadas
export const useLimpiarTareas = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API}/api/tareas/limpiar/${tableroId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error('Error al limpiar tareas')
      return res.json()
    },
    onSuccess: () => {
      // refresco tareas después de limpiar
      queryClient.invalidateQueries({
        queryKey: ['tareas', filtro, pagina, tableroId],
      })
    },
  })
}

// para editar el texto de una tarea
export const useEditarTarea = (
  filtro: string,
  pagina: number,
  tableroId: string
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, texto }: { id: string; texto: string }) => {
      const res = await fetch(`${API}/api/tareas/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      })

      if (!res.ok) throw new Error('Error al editar tarea')
      return await res.json()
    },

    // hago update optimista para que se vea rápido
    onMutate: async ({ id, texto }) => {
      await queryClient.cancelQueries({ queryKey: ['tareas', filtro, pagina, tableroId] })

      const anterior = queryClient.getQueryData(['tareas', filtro, pagina, tableroId])

      queryClient.setQueryData(['tareas', filtro, pagina, tableroId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          tareas: old.tareas.map((t: any) =>
            t.id === id ? { ...t, texto } : t
          ),
        }
      })

      return { anterior }
    },

    // si hay error, vuelvo a lo anterior
    onError: (_err, _vars, context) => {
      if (context?.anterior) {
        queryClient.setQueryData(['tareas', filtro, pagina, tableroId], context.anterior)
      }
    },

    // cuando termina, refresco tareas
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', filtro, pagina, tableroId] })
    },
  })
}



