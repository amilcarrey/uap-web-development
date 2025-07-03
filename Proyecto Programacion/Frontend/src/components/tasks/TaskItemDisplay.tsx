// src/components/TaskItemDisplay.tsx
import React from 'react';

interface Props {
  content: string;
  isViewer: boolean;
  upperCase: boolean;
  onToggle: (e: React.FormEvent) => void;
  isToggling: boolean;
}

/**
 * Componente para mostrar el contenido de una tarea
 * Separado para mantener TaskItem más limpio
 */
export function TaskItemDisplay({ 
  content, 
  isViewer, 
  upperCase, 
  onToggle, 
  isToggling 
}: Props) {
  return (
    <form onSubmit={onToggle} className="task-form">
      <label className="form-label">
        <button
          type="submit"
          className={`form-button ${isViewer ? 'opacity-30 cursor-not-allowed bg-gray-200' : ''}`}
          disabled={isToggling || isViewer}
          title={isViewer ? "Solo lectura - No puedes modificar tareas" : "Completar tarea"}
        />
        <span className={`${isViewer ? 'text-gray-500 italic' : ''}`}>
          {upperCase ? content.toUpperCase() : content}
        </span>
      </label>
    </form>
  );
}
