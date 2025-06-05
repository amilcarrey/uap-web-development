import { useState } from 'react'
import TodoList from './components/TodoList'
import TodoForm from './components/TodoForm'
import TodoFilters from './components/TodoFilters'
import Pagination from './components/Pagination'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import Toast from './components/Toast'
import useUIStore from './stores/uiStore'
import { useTodos } from './hooks/useTodos'

const PAGE_SIZE = 5

function App() {
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const { setNotification, clearNotification } = useUIStore()

  const {
    data,
    isLoading,
    isError,
    error,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    isAdding,
    isEditing,
    isToggling,
    isDeleting,
    clearCompleted,
  } = useTodos(page, PAGE_SIZE)

  const todos = data || []
  const total = data?.total || 0

  // Filtrado local (si se quiere filtrar por completadas, etc)
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // Handlers
  const handleAdd = (text) => {
    addTodo(text, {
      onSuccess: () => {
        setNotification({ type: 'success', message: 'Tarea agregada' })
        console.log('Tarea agregada:', text)
      },
      onError: () => setNotification({ type: 'error', message: 'Error al agregar tarea' })
    })
  }

  const handleToggle = (id) => {
    const todo = todos.find(t => t.id === id)
    toggleTodo(todo, {
      onSuccess: () => {
        setNotification({ type: 'success', message: 'Tarea actualizada' })
        console.log('Tarea marcada como completada/pending:', todo)
      },
      onError: () => setNotification({ type: 'error', message: 'Error al actualizar tarea' })
    })
  }

  const handleDelete = (id) => {
    deleteTodo(id, {
      onSuccess: () => {
        setNotification({ type: 'success', message: 'Tarea eliminada' })
        console.log('Tarea eliminada:', id)
      },
      onError: () => setNotification({ type: 'error', message: 'Error al eliminar tarea' })
    })
  }

  const handleEdit = (todo) => setEditingId(todo.id)
  const handleSaveEdit = (id, text) => {
    editTodo({ id, text }, {
      onSuccess: () => {
        setNotification({ type: 'success', message: 'Tarea editada' })
        setEditingId(null)
        console.log('Tarea editada:', { id, text })
      },
      onError: () => setNotification({ type: 'error', message: 'Error al editar tarea' })
    })
  }
  const handleCancelEdit = () => setEditingId(null)

  const handleClearCompleted = () => {
    clearCompleted(undefined, {
      onSuccess: () => {
        setNotification({ type: 'success', message: 'Tareas completadas eliminadas' })
        setPage(1)
      },
      onError: () => setNotification({ type: 'error', message: 'Error al limpiar completadas' })
    })
  }

  return (
    <>
      {/* Fondo animado */}
      <div className="bg-animated-gradient"></div>
      {/* Burbujas animadas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${6 + Math.random() * 10}px`,
              height: `${6 + Math.random() * 10}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-${Math.random() * 20}px`,
              animation: `bubbleUp ${5 + Math.random() * 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      {/* Contenido principal */}
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-xl bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30 animate-fadeIn">
          <h1 className="text-4xl font-bold text-center text-white mb-8 tracking-widest">TO-DO</h1>
          <TodoForm onAdd={handleAdd} />
          <TodoFilters 
            currentFilter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
            completedCount={filteredTodos.filter(t => t.completed).length}
          />
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorMessage message={error?.message || 'Error al cargar tareas'} onClose={clearNotification} />
          ) : (
            <>
              <TodoList
                todos={filteredTodos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
                editingId={editingId}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
              />
              <Pagination page={page} total={total} limit={PAGE_SIZE} setPage={setPage} />
            </>
          )}
        </div>
      </div>
      <Toast />
    </>
  )
}

export default App
