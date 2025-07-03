import { useState } from 'react';
import { useConfigStore } from '../../stores/configStore';
import { useToggleTask, useDeleteTask, useEditTask } from '../../hooks/task';
import { useIsViewer } from '../../hooks/useUserPermissions';
import type { Task } from '../../types/task';
import toast from 'react-hot-toast';

interface Props {
  task: Task;
  searchTerm: string;
  tabId: string;
}

/**
 * Componente TaskSearchResult
 * Muestra una tarea en los resultados de búsqueda de forma minimalista.
 * Permite todas las acciones: editar, eliminar, marcar como completada.
 * Resalta el término de búsqueda en el contenido de la tarea.
 */
export function TaskSearchResult({ task, searchTerm, tabId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.content);
  
  const upperCase = useConfigStore(state => state.upperCaseDescription);
  const isViewer = useIsViewer(tabId);
  
  const { mutate: toggleTask } = useToggleTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: editTask } = useEditTask();
  
  // Función para resaltar el término de búsqueda en el texto
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleToggle = () => {
    if (isViewer) {
      toast("Solo puedes ver las tareas de este tablero", { icon: "👁️" });
      return;
    }
    toggleTask({ 
      taskId: task.id, 
      tabId, 
      completed: !task.active 
    });
  };

  const handleDelete = () => {
    if (isViewer) {
      toast("Solo puedes ver las tareas de este tablero", { icon: "👁️" });
      return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask({ taskId: task.id, tabId });
    }
  };

  const handleEdit = () => {
    if (isViewer) {
      toast("Solo puedes ver las tareas de este tablero", { icon: "👁️" });
      return;
    }
    if (editText.trim() && editText !== task.content) {
      editTask({ 
        taskId: task.id, 
        tabId, 
        text: editText.trim() 
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(task.content);
      setIsEditing(false);
    }
  };

  const displayText = upperCase ? task.content.toUpperCase() : task.content;

  return (
    <div className="task-search-result flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
      {/* Checkbox para marcar como completada */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          task.active 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-green-400'
        } ${isViewer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={task.active ? 'Marcar como pendiente' : 'Marcar como completada'}
        disabled={isViewer}
      >
        {task.active && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* Contenido de la tarea */}
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEdit}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <p 
            className={`text-sm cursor-pointer ${task.active ? 'line-through opacity-70' : ''}`}
            onClick={() => !isViewer && setIsEditing(true)}
            title={isViewer ? 'Solo visualización' : 'Clic para editar'}
          >
            {highlightSearchTerm(displayText, searchTerm)}
          </p>
        )}
        
        {/* Metadatos de la tarea */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>ID: {task.id}</span>
          <span>•</span>
          <span>{task.active ? '✅ Completada' : '⏳ Pendiente'}</span>
          {task.createdAt && (
            <>
              <span>•</span>
              <span>Creada: {new Date(task.createdAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2">
        {!isEditing && (
          <>
            {/* Botón de editar */}
            <button
              onClick={() => !isViewer && setIsEditing(true)}
              className={`p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                isViewer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={isViewer ? 'Solo visualización' : 'Editar tarea'}
              disabled={isViewer}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Botón de eliminar */}
            <button
              onClick={handleDelete}
              className={`p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors ${
                isViewer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={isViewer ? 'Solo visualización' : 'Eliminar tarea'}
              disabled={isViewer}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}