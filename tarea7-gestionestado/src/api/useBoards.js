import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

const baseUrl = 'http://localhost:3000/boards'

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const res = await axios.get(baseUrl)
      return res.data
    },
  })
}

export function useAddBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newBoard) => axios.post(baseUrl, newBoard).then(res => res.data),
    onSuccess: () => {
      toast.success('Tablero creado')
      queryClient.invalidateQueries(['boards'])
    },
    onError: () => toast.error('Error al crear tablero'),
  })
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => axios.delete(`${baseUrl}/${id}`),
    onSuccess: () => {
      toast.success('Tablero eliminado')
      queryClient.invalidateQueries(['boards'])
    },
    onError: () => toast.error('Error al eliminar tablero'),
  })
}
