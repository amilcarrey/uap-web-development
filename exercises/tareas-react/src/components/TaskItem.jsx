// src/components/TaskItem.jsx

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center mb-2 bg-white p-2 rounded shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mr-2"
      />
      <span
        className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}
      >
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 px-2"
      >
        Eliminar
      </button>
    </li>
  );
}
