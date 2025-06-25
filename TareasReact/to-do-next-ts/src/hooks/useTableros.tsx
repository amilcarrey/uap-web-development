import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Tablero {
  id: string
  nombre: string
  propietarioId: string
}

export type RolTablero = 'propietario' | 'editor' | 'lectura'

export interface TableroExtendido extends Tablero {
  rol: RolTablero
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function useTableros() {
  // para refrescar la cache de tableros
  const queryClient = useQueryClient()

  // traigo todos los tableros del usuario
  const fetchTableros = async (): Promise<TableroExtendido[]> => {
    const res = await fetch(`${API_URL}/api/tableros`, {
      credentials: 'include',
    })

    if (!res.ok) throw new Error('No se pudieron cargar los tableros')
    return res.json()
  }

  // crear un tablero nuevo
  const crearTablero = useMutation({
    mutationFn: async (nombre: string) => {
      const res = await fetch(`${API_URL}/api/tableros`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      })

      if (!res.ok) throw new Error('Error al crear el tablero')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] })
    },
  })

  // eliminar un tablero
  const eliminarTablero = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/tableros/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Error al eliminar el tablero')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] })
    },
  })

  // compartir tablero con otro usuario
  const compartirTablero = useMutation({
    mutationFn: async ({
      tableroId,
      email,
      rol,
    }: {
      tableroId: string
      email: string
      rol: 'propietario' | 'editor' | 'lectura'
    }) => {
      const res = await fetch(`${API_URL}/api/tableros/${tableroId}/compartir`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, rol }),
      })

      if (!res.ok) throw new Error('Error al compartir el tablero')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tableros'] })
    },
  })

  // hook principal, devuelvo todo lo que necesito para tableros
  const { data: tableros, isLoading } = useQuery<TableroExtendido[]>({
    queryKey: ['tableros'],
    queryFn: fetchTableros,
  })

  return { tableros, crearTablero, eliminarTablero, compartirTablero, isLoading }
}
