// src/components/TaskItem.jsx
import React, { useState } from 'react';
import { useEditTask } from '../hooks/useTasks';

export default function TaskItem({ task, onToggle, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const editTaskMutation = useEditTask(task.boardId);

  function handleSaveEdit() {
    if (!editText.trim()) return;
    editTaskMutation.mutate(
      { id: task.id, title: editText.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }

  function handleCancelEdit() {
    setEditText(task.title);
    setIsEditing(false);
  }

  return (
    <li className="flex items-center mb-2 bg-amber-100 p-2 rounded shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        className="mr-2"
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 border p-1 rounded mr-2"
        />
      ) : (
        <span
          className={`flex-1 ${
            task.completed ? 'line-through text-gray-500' : ''
          }`}
        >
          {task.title}
        </span>
      )}

      {isEditing ? (
        <div className="space-x-2">
          <button
            onClick={handleSaveEdit}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            onClick={handleCancelEdit}
            className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 px-2"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-red-500 hover:text-red-700 px-2"
          >
            🗑
          </button>
        </div>
      )}
    </li>
  );
}
