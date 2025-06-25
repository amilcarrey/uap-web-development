import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const BACKEND_URL = 'http://localhost:4321/api'

export function useRemoteSettings() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/settings`, { credentials: 'include' })
      if (!res.ok) throw new Error('No se pudieron cargar las configuraciones')
      return res.json()
    }
  })

  const mutation = useMutation({
    mutationFn: async (data: { autoRefreshInterval: number, viewMode: string }) => {
      const res = await fetch(`${BACKEND_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error('No se pudieron guardar las configuraciones')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    }
  })

  return { ...query, saveSettings: mutation.mutate, isSaving: mutation.isPending }
}