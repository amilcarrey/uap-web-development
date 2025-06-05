import TodoItem from './TodoItem'

export default function TodoList({ todos, onToggle, onDelete, onEdit, editingId, onSaveEdit, onCancelEdit }) {
  if (!todos.length) {
    return <div className="text-center text-white/80 py-8">No hay tareas.</div>;
  }
  return (
    <ul className="space-y-3">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          isEditing={editingId === todo.id}
          onSaveEdit={text => onSaveEdit(todo.id, text)}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </ul>
  )
} 