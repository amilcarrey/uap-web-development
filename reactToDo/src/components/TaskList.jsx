export default function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <li 
          key={task.id}
          className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="h-5 w-5 mr-3 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className={`flex-grow ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.text}
          </span>
          <div className="flex space-x-2">
            <button className="p-1 text-gray-400 hover:text-blue-500">
              ✏️
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              ×
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}