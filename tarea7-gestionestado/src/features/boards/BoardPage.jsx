import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTasks } from '../../api/useTasks'
import TaskItem from '../tasks/TaskItem'
import TaskForm from '../tasks/TaskForm'

const TASKS_PER_PAGE = 5

function BoardPage() {
  const { id } = useParams()
  const boardId = parseInt(id)
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useTasks(boardId, page, TASKS_PER_PAGE)

  if (isLoading) return <p>Cargando tareas...</p>
  if (isError) return <p>Error cargando tareas.</p>

  const totalPages = Math.ceil(data.total / TASKS_PER_PAGE)

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tablero {boardId}</h1>

      <TaskForm />

      <ul className="space-y-2 mb-4">
        {data.data.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          ⬅️ Anterior
        </button>

        <span className="text-sm">Página {page} de {totalPages}</span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Siguiente ➡️
        </button>
      </div>
    </div>
  )
}

export default BoardPage
