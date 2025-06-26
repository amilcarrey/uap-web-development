import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '../store/useUIStore'
import { toast } from 'react-toastify'

export default function TaskForm({ boardId }) {
  const editingTaskId = useUIStore((state) => state.editingTaskId)
  const setEditingTask = useUIStore((state) => state.setEditingTask)
  const queryClient = useQueryClient()

  const [text, setText] = useState('')

  // Si estás editando una tarea, buscala y cargá su texto
  useEffect(() => {
    if (editingTaskId) {
      const current = queryClient
        .getQueryData(['tasks', boardId])
        ?.find((t) => t.id === editingTaskId)
      setText(current?.text || '')
    }
  }, [editingTaskId, boardId, queryClient])

  // Mutación para agregar o editar
  const mutation = useMutation({
    mutationFn: async () => {
      const url = editingTaskId
        ? `http://localhost:5000/api/tasks/${editingTaskId}`
        : `http://localhost:5000/api/tasks`
      const method = editingTaskId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, boardId }),
      })

      if (!res.ok) throw new Error('Error al guardar tarea')
      return res.json()
    },
    onSuccess: () => {
       toast.success(editingTaskId ? 'Tarea actualizada' : 'Tarea agregada')
  // ... resto
},
onError: () => {
  toast.error('Error al guardar tarea')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    mutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tarea..."
        className="p-2 border rounded flex-1"
      />
      <button
        type="submit"
        className="px-4 text-white bg-blue-500 rounded"
        disabled={mutation.isPending}
      >
        {editingTaskId ? 'Guardar' : 'Agregar'}
      </button>
      {editingTaskId && (
        <button
          type="button"
          onClick={() => {
            setEditingTask(null)
            setText('')
          }}
          className="text-gray-500 underline"
        >
          Cancelar
        </button>
      )}
    </form>
  )
}
