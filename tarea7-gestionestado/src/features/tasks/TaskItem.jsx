import { useState } from 'react'
import { useDeleteTask, useToggleTask } from '../../api/useTasks'
import TaskEditForm from './TaskEditForm'
import useConfigStore from '../../store/configStore'

function TaskItem({ task }) {
  const { mutate: deleteTask } = useDeleteTask()
  const { mutate: toggleTask } = useToggleTask()
  const [isEditing, setIsEditing] = useState(false)
  const mayusculas = useConfigStore((s) => s.mayusculas)

  const descripcion = mayusculas
    ? task.description.toUpperCase()
    : task.description

  return (
    <li className="bg-white p-4 rounded shadow flex justify-between items-center">
      {isEditing ? (
        <TaskEditForm taskToEdit={task} onCancel={() => setIsEditing(false)} />
      ) : (
        <>
          <span
            className={`cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
            onClick={() => toggleTask(task)}
            title="Click para completar"
          >
            {descripcion}
          </span>
          <button
            className="text-blue-500 font-bold"
            onClick={() => setIsEditing(true)}
            title="Editar tarea"
          >
            ✏️
          </button>
          <button
            className="text-red-500 font-bold"
            onClick={() => deleteTask(task)}
            title="Eliminar tarea"
          >
            🗑️
          </button>
        </>
      )}
    </li>
  )
}

export default TaskItem
