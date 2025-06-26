import { useState } from 'react'
import { useAddTask } from '../../api/useTasks'
import { useParams } from 'react-router-dom'

function TaskForm() {
  const { id } = useParams()
  const boardId = parseInt(id)
  const [description, setDescription] = useState('')
  const { mutate: addTask, isPending } = useAddTask()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) return

    addTask(
      { description, completed: false, boardId },
      { context: { boardId } }
    )

    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Nueva tarea..."
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isPending}
      >
        {isPending ? 'Agregando...' : 'Agregar'}
      </button>
    </form>
  )
}

export default TaskForm
