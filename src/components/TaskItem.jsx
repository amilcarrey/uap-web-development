function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
      />
      <span className={task.completed ? 'completed' : ''}>{task.name}</span>
      <button onClick={onDelete} className="delete-btn">🗑</button>
    </li>
  );
}

export default TaskItem;
