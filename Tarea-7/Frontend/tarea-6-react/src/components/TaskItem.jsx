// src/components/TaskItem.jsx
import React from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={e => onToggle(task.id, e.target.checked)}
        />
        <span className="checkmark"></span>
      </label>
      <span className="task-text" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button className="delete-btn" onClick={() => onDelete(task.id)}>
        🗑️
      </button>
    </li>
  );
}