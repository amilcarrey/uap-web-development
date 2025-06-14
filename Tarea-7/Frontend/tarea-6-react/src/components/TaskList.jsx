// src/components/TaskList.jsx
import React from 'react';

export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id, !task.completed)}
            />
            <span className="task-text">{task.text}</span>
          </label>
          <button className="delete-btn" onClick={() => onDelete(task.id)}>🗑️</button>
        </li>
      ))}
    </ul>
  );
}
