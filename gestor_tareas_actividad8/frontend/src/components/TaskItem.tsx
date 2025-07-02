import { useUIStore } from '../store/uiStore';
import type { Task } from '../types/Task';
import { useSettings } from '../context/SettingsContext';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { useParams } from 'react-router-dom';

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
}

const TaskItem = ({ task, onToggle }: Props) => {
  const setEditingTask = useUIStore((s) => s.setEditingTask);
  const { uppercaseDescriptions } = useSettings();
  const { boardId } = useParams();
  const { mutate: deleteTask } = useDeleteTask(boardId || '', 1); // Asumimos page 1, o adaptar si se desea dinámica

  const displayedText = uppercaseDescriptions
    ? task.text.toUpperCase()
    : task.text;

  return (
    <li className="flex justify-between items-center border-b py-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {displayedText}
        </span>
      </div>
      <div className="space-x-2">
        <button
          onClick={() => setEditingTask(task)}
          className="text-blue-500 hover:underline"
        >
          ✏️
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:underline"
        >
          🗑️
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
