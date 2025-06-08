import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTasks, type Filter, type Task } from './hooks/useTasks'
import { useEditTask } from './hooks/useEditTask'
import { toast } from 'react-hot-toast'
import { useSettingsStore } from "./stores/settings";
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'




const BACKEND_URL = 'http://localhost:4321/api'



function SettingsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { refetchInterval, setRefetchInterval, uppercaseDescriptions, toggleUppercaseDescriptions } = useSettingsStore()

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">Configuración</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Intervalo de refresco (ms):</label>
          <input
            type="number"
            value={refetchInterval}
            min={1000}
            step={1000}
            onChange={e => setRefetchInterval(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercaseDescriptions}
              onChange={toggleUppercaseDescriptions}
            />
            Descripciones en mayúsculas
          </label>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}



function TaskItem({
  task,
  isEditing,
  setIsEditing,
}: {
  task: Task
  isEditing: boolean
  setIsEditing: (val: boolean) => void
}) {
  const [value, setValue] = useState(task.task_content)
  const editTask = useEditTask()
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


  const queryClient = useQueryClient()




  // Usamos el hook personalizado
  const { data, isLoading, isError, error } = useTasks({ boardId, filter, page, limit, refetchInterval })

  const tasks = data?.tasks ?? []
  const totalPages = data?.totalPages ?? 1

  // Mutación para agregar tareas
  const addTaskMutation = useMutation({
    mutationFn: async (task: string) => {
      const formData = new FormData()
      formData.append('task', task)
      formData.append('boardId', boardId)

      const res = await fetch(`${BACKEND_URL}/add-task`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error al agregar la tarea')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
      setNewTask('') 
    },
  })
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return
    addTaskMutation.mutate(trimmed)
  }

  const toggleTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData()
      formData.append('id', id.toString())
      formData.append('action', 'toggle')
      formData.append('boardId', boardId)

      const res = await fetch(`${BACKEND_URL}/update-task`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error al cambiar el estado de la tarea')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
    },
  })

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      const formData = new FormData()
      formData.append('id', id.toString())
      formData.append('action', 'delete')
      formData.append('boardId', boardId)

      const res = await fetch(`${BACKEND_URL}/update-task`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error al eliminar la tarea')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
    },
  })

  const clearCompletedMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      formData.append('boardId', boardId)
      const res = await fetch(`${BACKEND_URL}/clear-completed`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Error al borrar tareas completadas')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', filter, page, limit] })
    },
  })

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
                  onClick={() => toggleTaskMutation.mutate(task.id)}
                  className="text-xl cursor-pointer transition-transform transform hover:scale-110"
                >
                  {task.completed ? '✅' : '⬜'}
                </button>

                <TaskItem
                  task={task}
                  isEditing={editingTaskId === task.id}
                  setIsEditing={(val) => setEditingTaskId(val ? task.id : null)}
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
    </div>
  )
}

export default App
