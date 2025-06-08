import { useState } from 'react'
import { toast } from 'react-hot-toast' 
import { useEditTask } from '../hooks/useEditTask'
import { type Task } from '../hooks/useTasks'
import { useSettingsStore } from '../stores/settings'



export function TaskItem({
  task,
  isEditing,
  setIsEditing,
  boardId
}: {
  task: Task
  isEditing: boolean
  setIsEditing: (val: boolean) => void
  boardId: string
}) {
  const [value, setValue] = useState(task.task_content)
  const editTask = useEditTask(boardId)
  const { uppercaseDescriptions } = useSettingsStore()

  const handleSave = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      toast.error('La tarea no puede estar vacía')
      return
    }
    if (trimmed === task.task_content) {
      setIsEditing(false)
      return
    }
    editTask.mutate(
      { id: task.id, content: trimmed },
      {
        onSuccess: () => {
          toast.success('Tarea editada')
          setIsEditing(false)
        },
        onError: () => {
          toast.error('Error al editar la tarea')
        },
      }
    )
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <input
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-base"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') {
              setIsEditing(false)
              setValue(task.task_content)
            }
          }}
          autoFocus
        />
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          aria-label="Guardar edición"
        >
          ✔
        </button>
        <button
          onClick={() => {
            setIsEditing(false)
            setValue(task.task_content)
          }}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
          aria-label="Cancelar edición"
        >
          ✖
        </button>
      </div>
    )
  }

  return (
    <span
      className={`text-center select-none flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
      tabIndex={0}
      aria-label={`Tarea: ${task.task_content}`}
    >
      {uppercaseDescriptions ? task.task_content.toUpperCase() : task.task_content}
    </span>
  )
}