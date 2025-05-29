import type { Task } from "../state/taskStore";
import { useTaskStore } from "../state/taskStore";

export default function TaskItem({ task }: { task: Task }) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  return (
    <li className="flex justify-between items-center bg-orange-100 p-2 rounded">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />
        <span className={task.completed ? "line-through text-gray-500" : ""}>
          {task.name}
        </span>

      </label>
      <button
        onClick={() => deleteTask(task.id)}
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        Eliminar
      </button>
    </li>
  );
}
