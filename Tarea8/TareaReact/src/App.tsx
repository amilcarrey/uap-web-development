import { useState, type FormEvent } from 'react'
import { useTasks, type Filter} from './hooks/useTasks'
import { useSettingsStore } from "./stores/settings";
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { TaskItem } from './components/TaskItem'
import { SettingsModal } from './components/SettingsModal'
import ToastContainer from './components/ToastContainer';
import { useAddTaskMutation } from './hooks/useAddTaskMutation';
import { useDeleteTaskMutation } from './hooks/useDeleteTaskMutation';
import { useToggleTaskMutation } from './hooks/useToggleTaskMutation';
import { useClearCompletedMutation } from './hooks/useClearCompletedMutation';


function App() {
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)
  const limit = 5
  const { refetchInterval } = useSettingsStore()
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { boardId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!boardId) navigate("/")
  }, [boardId, navigate])

  if (!boardId) return null

  // Usamos el hook personalizado
  const { data, isLoading, isError, error } = useTasks({ boardId, filter, page, limit, refetchInterval })

  const tasks = data?.tasks ?? []
  const totalPages = data?.totalPages ?? 1

  // Hook para agregar tareas
  const addTaskMutation = useAddTaskMutation(boardId, filter, page, limit, setNewTask)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTaskMutation.mutate(trimmed)
  }

  // Hook para cambiar el estado de las tareas
  const toggleTaskMutation = useToggleTaskMutation(boardId, filter, page, limit)
  
  // Hook para eliminar tareas
  const deleteTaskMutation = useDeleteTaskMutation(boardId, filter, page, limit)

  // Hook para limpiar tareas completadas
  const clearCompletedMutation = useClearCompletedMutation(boardId, filter, page, limit)

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter)
    setPage(1)
  }

  if (isLoading) return <p className="text-center">Cargando tareas...</p>
  if (isError) return <p className="text-red-500 text-center">Error: {(error as Error).message}</p>

  return (
    <div className="min-h-screen bg-purple-100 p-6">
      <div className="max-w-2xl mx-auto mt-24 p-8 bg-purple-200 rounded-2xl shadow-lg">
        <button
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded transition-colors"
        >
          ← Volver a tableros
        </button>
        <h1 className="text-4xl text-center text-gray-800">TODO</h1>

        <form onSubmit={handleSubmit} className="flex justify-center mb-4 w-full">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            required
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="ml-4 p-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors"
          >
            ADD
          </button>
        </form>

        {addTaskMutation.isPending && <p className="text-gray-500">Agregando tarea...</p>}
        {addTaskMutation.isError && (
          <p className="text-red-500">
            Error: {(addTaskMutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${filter === f
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent'
                }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Incompletas' : 'Completadas'}
            </button>
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No hay tareas para mostrar</p>
        )}
        <>


          <ul id="task-list" className="list-none p-0 m-0">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-gray-100 mb-2 p-5 rounded-lg flex items-center gap-4"
              >
                <button
                  onClick={() => toggleTaskMutation.mutate(task)}
                  className="text-xl cursor-pointer transition-transform transform hover:scale-110"
                >
                  {task.completed ? '✅' : '⬜'}
                </button>

                <TaskItem
                  task={task}
                  isEditing={editingTaskId === task.id}
                  setIsEditing={(val) => setEditingTaskId(val ? task.id : null)}
                  boardId={boardId}
                />

                <button
                  onClick={() => setEditingTaskId(task.id)}
                  className="text-gray-500 hover:text-blue-600"
                  aria-label="Editar tarea"
                  title="Editar tarea"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                  className="text-xl text-red-500 hover:text-red-700 transition-colors"
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-2xl hover:text-blue-600"
              aria-label="Abrir configuración"
              title="Configuración"
            >
              ⚙️
            </button>
          </div>
          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />


          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              ⬅ Anterior
            </button>
            <span className="self-center text-gray-800 font-semibold">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Siguiente ➡
            </button>
          </div>
        </>


        <div className="mt-8 text-center">
          <button
            onClick={() => clearCompletedMutation.mutate()}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
          >
            Borrar las tareas completadas
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App
