import { useUIStore } from '../store/uiStore';
import type { Task } from '../types/Task';

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  const setEditingTask = useUIStore((s) => s.setEditingTask);

  return (
    <li className="flex justify-between items-center border-b py-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {task.text}
        </span>
      </div>
      <div className="space-x-2">
        <button onClick={() => setEditingTask(task)} className="text-blue-500">✏️</button>
        <button onClick={() => onDelete(task.id)} className="text-red-500">🗑️</button>
      </div>
    </li>
  );
};

export default TaskItem;
