// src/components/TaskForm.jsx
import React, { useEffect, useState } from 'react';
import { useUIStore } from '../store/useUIStore';

export default function TaskForm({ onAdd, onEdit }) {
  const editingTask = useUIStore((s) => s.editingTask);
  const clearEditingTask = useUIStore((s) => s.clearEditingTask);
  const [text, setText] = useState('');

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (editingTask) {
      onEdit(editingTask.id, text.trim());
      clearEditingTask();
    } else {
      onAdd(text.trim());
    }
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} id="task-form">
      <input
        type="text"
        id="nueva-tarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="¿Qué querés hacer?"
      />
      <button type="submit">
        {editingTask ? 'Guardar cambios' : 'Agregar'}
      </button>
      {editingTask && (
        <button type="button" onClick={() => { clearEditingTask(); setText(''); }}>
          Cancelar
        </button>
      )}
    </form>
  );
}
