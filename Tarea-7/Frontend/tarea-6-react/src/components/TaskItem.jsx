// src/components/TaskItem.jsx
/* recibe id directamente para facilitar */
export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
        />
        <span className="checkmark" />
      </label>
      <span className="task-text" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.description}
      </span>
      <button className="delete-btn" onClick={() => onDelete(task.id)}>🗑️</button>
    </li>
  );
}
