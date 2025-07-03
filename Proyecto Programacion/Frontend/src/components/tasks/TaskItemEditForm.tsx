// src/components/TaskItemEditForm.tsx
import React from 'react';

interface Props {
  editText: string;
  setEditText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isDisabled: boolean;
}

/**
 * Componente para el formulario de edición de tareas
 * Separado para mantener TaskItem más limpio
 */
export function TaskItemEditForm({ 
  editText, 
  setEditText, 
  onSubmit, 
  onCancel, 
  isDisabled 
}: Props) {
  return (
    <form onSubmit={onSubmit} className="edit-form flex flex-1 items-center gap-2">
      <input
        type="text"
        value={editText}
        onChange={e => setEditText(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
        disabled={isDisabled}
        autoFocus
      />
      <button type="submit" className="form-button" disabled={isDisabled}>
        Guardar
      </button>
      <button type="button" className="form-button" onClick={onCancel} disabled={isDisabled}>
        Cancelar
      </button>
    </form>
  );
}
