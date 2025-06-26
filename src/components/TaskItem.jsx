import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '../store/useUIStore'

export default function TaskItem({ task, boardId }) {
  const queryClient = useQueryClient()
  const setEditingTask = useUIStore((state) => state.setEditingTask)
  const uppercase = useUIStore((state) => state.config.uppercase)

  const toggleMutation = useMutation({
    mutationFn: async () => {
      await fetch(`http://localhost:5000/api/tasks/${task.id}/toggle`, {
        method: 'POST'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks', boardId])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: 'DELETE'
      })
    },
    onSuccess: () => {toast.success('Tarea eliminada')
  queryClient.invalidateQueries(['tasks', boardId])
},
onError: () => {
  toast.error('No se pudo eliminar la tarea')
}
    
  })

  return (
    <li className="flex justify-between items-center bg-gray-100 p-2 rounded">
      <label className="flex gap-2 items-center flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleMutation.mutate()}
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {uppercase ? task.text.toUpperCase() : task.text}
        </span>
      </label>

      <div className="flex gap-2 ml-2">
        <button onClick={() => setEditingTask(task.id)}>✏️</button>
        <button onClick={() => deleteMutation.mutate()}>🗑️</button>
      </div>
    </li>
  )
}
