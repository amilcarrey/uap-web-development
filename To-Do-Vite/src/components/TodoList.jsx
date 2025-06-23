import TodoItem from './TodoItem'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

export default function TodoList({ 
  todos, 
  onToggle, 
  onDelete, 
  onEdit, 
  editingId, 
  onSaveEdit, 
  onCancelEdit, 
  isLoading = false,
  error = null,
  emptyMessage = "No hay tareas.",
  className = ""
}) {
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className={`text-center text-white/60 py-8 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          editingId={editingId}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
} 