// src/components/TaskItem.jsx
import React, { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const startEdit = () => {
    setDraft(task.title);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft(task.title);
  };

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== task.title) {
      onEdit(task.id, draft.trim());
    }
    setIsEditing(false);
  };

  return (
    <li className="flex items-center mb-2 bg-amber-100 p-2 rounded shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
        className="mr-2"
      />

      {/* 1) Modo “lectura” vs Modo “editar” */}
      {!isEditing ? (
        <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </span>
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 border p-1 rounded mr-2"
        />
      )}

      {/* 2) Botones según modo */}
      {!isEditing ? (
        <>
          <button
            onClick={startEdit}
            className="text-blue-500 hover:text-blue-700 px-2"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700 px-2"
          >
            Eliminar
          </button>
        </>
      ) : (
        <>
          <button
            onClick={saveEdit}
            className="text-green-500 hover:text-green-700 px-2"
          >
            Guardar
          </button>
          <button
            onClick={cancelEdit}
            className="text-gray-500 hover:text-gray-700 px-2"
          >
            Cancelar
          </button>
        </>
      )}
    </li>
  );
}
