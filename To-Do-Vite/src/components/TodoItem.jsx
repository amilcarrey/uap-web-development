import { useState, useRef, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useUserSettings } from '../hooks/useSettings';
import { Check, Edit, Trash2, X, Save } from 'lucide-react';

export default function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onSaveEdit, 
  onCancelEdit, 
  editingId, 
  isLoading = false 
}) {
  const { data: settings = {} } = useUserSettings();
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);
  const isEditing = editingId === todo.id;

  useEffect(() => {
    setEditText(todo.text);
  }, [todo.text, isEditing]);

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onSaveEdit(editText.trim());
    } else {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      onCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border bg-white/10 border-white/20">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-5 h-5"></div> {/* Espacio para mantener alineación */}
          <div className="flex-1 flex gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-1 rounded bg-white/20 text-white border border-white/30 focus:border-purple-400 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="text-green-400 hover:text-green-300 transition-colors p-1"
              title="Guardar"
            >
              <FaCheck size={16} />
            </button>
            <button
              onClick={() => {
                setEditText(todo.text);
                onCancelEdit();
              }}
              className="text-red-400 hover:text-red-300 transition-colors p-1"
              title="Cancelar"
            >
              <FaTimes size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
        todo.completed
          ? 'bg-green-500/20 border-green-500/30'
          : 'bg-white/10 border-white/20 hover:bg-white/15'
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onToggle(todo.id)}
          disabled={isLoading}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-white/50 hover:border-green-500'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={todo.completed ? 'Desmarcar tarea' : 'Completar tarea'}
        >
          {todo.completed && <FaCheck size={12} />}
        </button>
        
        <span
          className={`flex-grow cursor-pointer ${
            todo.completed ? 'line-through text-gray-500' : 'text-white'
          } ${settings.uppercase_tasks ? 'uppercase' : ''}`}
          style={{ color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}
          onClick={() => onEdit(todo.id)}
        >
          {todo.text}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(todo.id)}
          disabled={isLoading}
          className="text-blue-400 hover:text-blue-300 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Editar tarea"
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
          className="text-red-400 hover:text-red-300 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Eliminar tarea"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
} 