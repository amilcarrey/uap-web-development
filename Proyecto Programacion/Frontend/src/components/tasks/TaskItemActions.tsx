// src/components/TaskItemActions.tsx
import React from 'react';

interface Props {
  isViewer: boolean;
  onEdit: () => void;
  onDelete: (e: React.FormEvent) => void;
  isEditingDisabled: boolean;
  isDeletingDisabled: boolean;
}

/**
 * Componente para las acciones de una tarea (editar, eliminar)
 * Separado para mantener TaskItem más limpio
 */
export function TaskItemActions({ 
  isViewer, 
  onEdit, 
  onDelete, 
  isEditingDisabled, 
  isDeletingDisabled 
}: Props) {
  if (isViewer) {
    return (
      <div className="flex gap-2 opacity-30">
        <span 
          className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded border cursor-not-allowed" 
          title="Solo lectura"
        >
          👁️ Solo lectura
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="form-button"
        onClick={onEdit}
        disabled={isEditingDisabled}
        title="Editar tarea"
      >
        ✏️
      </button>
      <form onSubmit={onDelete} className="delete-form">
        <button
          type="submit"
          className="delete-button"
          disabled={isDeletingDisabled}
          title="Eliminar tarea"
        >
          🗑️
        </button>
      </form>
    </div>
  );
}
