import { useEffect, useState, type FormEvent } from 'react'

type Filter = 'all' | 'active' | 'completed'

type Task = {
  id: string
  title: string
  completed: boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : []
  })

  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = newTask.trim()
    if (!trimmed) return

    const newT: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
    }
    setTasks((prev) => [...prev, newT])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

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
          {filteredTasks.map((task) => (
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
                {task.title}
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
