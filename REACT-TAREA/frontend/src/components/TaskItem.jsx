// frontend/src/components/TaskItem.jsx
import React, { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleToggle = () => {
    onToggle(task.id, !task.completed);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleEditSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    await onEdit(task.id, trimmed);
    setIsEditing(false);
  };

  return (
    <div
      className="
        flex items-center justify-between 
        bg-white border border-gray-200 
        rounded-lg px-4 py-3 mb-3 
        shadow-sm hover:shadow-md transition
      "
      data-id={task.id}
    >
      <div className="flex items-center">
        <button
          onClick={handleToggle}
          className={`
            flex-none 
            w-6 h-6 
            rounded-full flex items-center justify-center 
            border-2 
            ${task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-400'
            } 
            hover:scale-110 transition-transform
          `}
        >
          {task.completed && '✓'}
        </button>

        {isEditing ? (
          <input
            type="text"
            className="
              ml-3 flex-grow px-2 py-1 
              border border-gray-300 rounded 
              focus:outline-none focus:ring-2 focus:ring-blue-400
            "
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave();
            }}
            autoFocus
          />
        ) : (
          <p
            className={`
              ml-3 flex-grow text-gray-800 text-lg 
              ${task.completed ? 'line-through text-gray-400' : ''}
            `}
          >
            {task.text}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={handleEditSave}
              className="
                text-green-600 hover:text-green-800 transition
              "
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(task.text);
              }}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-500 hover:text-yellow-700 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
