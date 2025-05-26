import type { Task } from "../types/task";
import { useDeleteTask } from "../hooks/tasks/useDeleteTask";
import { useUpdateTask } from "../hooks/tasks/useUpdateTask";
import { useUIStore } from "../store/useUIStore";

interface Props {
  task: Task;
}

export const TaskItem: React.FC<Props> = ({ task }) => {
  const delTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const setEditingTaskId = useUIStore((s) => s.setEditingTaskId);

  return (
    <li className="flex items-center justify-between py-1 border-b last:border-b-0">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => updateTask.mutate({ ...task, completed: !task.completed })}
          className="h-5 w-5 accent-blue-600"
        />
        <span className={task.completed ? "line-through text-gray-400" : ""}>{task.text}</span>
      </div>
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setEditingTaskId(task.id)}
          className="text-blue-500 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => delTask.mutate(task.id)}
          className="text-red-500 hover:underline"
        >
          🗑
        </button>
      </div>
    </li>
  );
};