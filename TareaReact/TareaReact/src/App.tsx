import { useEffect, useState, type FormEvent } from 'react'

const BACKEND_URL = 'http://localhost:4321/api' // Dirección del backend de Astro

type Filter = 'all' | 'active' | 'completed'

type Task = {
  id: number
  task_content: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  // Cargar tareas desde el servidor según el filtro
  const loadTasks = () => {
    fetch(`${BACKEND_URL}/get-tasks?filter=${filter}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error('Error al cargar tareas:', err))
  }

  useEffect(() => {
    loadTasks()
  }, [filter])

  // Agregar nueva tarea
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return

    const formData = new FormData()
    formData.append('task', trimmed)

    const res = await fetch(`${BACKEND_URL}/add-task`, {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      setNewTask('')
      loadTasks()
    }
  }

  // Marcar tarea como completada / incompleta
const toggleTask = async (id: number) => {
  const formData = new FormData()
  formData.append('id', id.toString())
  formData.append('action', 'toggle')

  const res = await fetch(`${BACKEND_URL}/update-task`, {
    method: 'POST',
    body: formData,
  })

  if (res.ok) loadTasks()
}

  // Eliminar tarea
const deleteTask = async (id: number) => {
  const formData = new FormData()
  formData.append('id', id.toString())
  formData.append('action', 'delete')

  const res = await fetch(`${BACKEND_URL}/update-task`, {
    method: 'POST',
    body: formData,
  })

  if (res.ok) loadTasks()
}

  // Eliminar tareas completadas
  const clearCompleted = async () => {
    await fetch(`${BACKEND_URL}/clear-completed`, {
      method: 'POST',
    })
    loadTasks()
  }

  return (
    <div className="min-h-screen bg-purple-100 p-6">
      <div className="max-w-2xl mx-auto mt-24 p-8 bg-purple-200 rounded-2xl shadow-lg">
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

        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          {(['all', 'active', 'completed'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                filter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent'
              }`}
            >
              {f === 'all'
                ? 'Todas'
                : f === 'active'
                ? 'Incompletas'
                : 'Completadas'}
            </button>
          ))}
        </div>

        <ul id="task-list" className="list-none p-0 m-0">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="bg-gray-100 mb-2 p-5 rounded-lg flex items-center justify-between"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="text-xl cursor-pointer transition-transform transform hover:scale-110"
              >
                {task.completed ? '✅' : '⬜'}
              </button>

              <span
                className={task.completed ? 'line-through text-gray-500' : ''}
              >
                {task.task_content}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-xl text-red-500 hover:text-red-700 transition-colors"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <button
            onClick={clearCompleted}
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
