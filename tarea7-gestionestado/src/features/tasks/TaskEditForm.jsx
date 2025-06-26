import { useState } from 'react'
import { useEditTask } from '../../api/useTasks'

function TaskEditForm({ taskToEdit, onCancel }) {
  const [description, setDescription] = useState(taskToEdit.description)
  const { mutate: editTask, isPending } = useEditTask()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) return

    editTask(
      { ...taskToEdit, description },
      {
        onSuccess: () => onCancel(),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={isPending}
      >
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
      >
        Cancelar
      </button>
    </form>
  )
}

export default TaskEditForm
