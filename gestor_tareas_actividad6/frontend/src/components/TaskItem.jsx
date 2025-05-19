function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between p-2 bg-white shadow rounded">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {task.text}
        </span>
      </label>
      <button onClick={onDelete} className="text-red-500 hover:text-red-700">
        Eliminar
      </button>
    </li>
  );
}

export default TaskItem;
