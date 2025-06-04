export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={task.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span>{task.text}</span>
          <button onClick={() => onDelete(task.id)}>×</button>
        </li>
      ))}
    </ul>
  );
}