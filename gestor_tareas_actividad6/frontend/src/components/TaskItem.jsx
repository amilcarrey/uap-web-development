const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <li className={`tarea ${task.completed ? 'completada' : ''}`}>
      {/* Checkbox */}
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
          id={`task-${task.id}`}
          className="checkbox-real"
        />
        <label htmlFor={`task-${task.id}`} className="checkbox-custom"></label>
      </div>

      {/* Solo texto afectado por estado completado */}
      <span className="task-text">
        <span className={task.completed ? 'completada' : ''}>
          {task.text}
        </span>
      </span>

      {/* Papelera no debe verse afectada */}
      <button 
        className="delete-btn" 
        onClick={() => onDelete(task.id)}
        aria-label="Eliminar tarea"
      >
        🗑️
      </button>
    </li>
  );
};

export default TaskItem;
