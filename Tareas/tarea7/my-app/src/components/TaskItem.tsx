import { Task } from '../types/Task';
import { useTasks } from '../hooks/useTasks';
import { useConfigStore } from '../store/configStore';

interface TaskItemProps {
  task: Task;
  boardId: string;
  page: number;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, boardId, page }) => {
  const { editTask, removeTask } = useTasks(boardId, page, 10000); // Adjust refetchInterval as needed

  const handleToggle = () => {
    editTask.mutate({ id: task.id, updates: { completed: !task.completed } });
  };

  const handleDelete = () => {
    removeTask.mutate(task.id);
  };

  return (
    <div>
      <span
        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
      >
        {task.description}
      </span>
      <button onClick={handleToggle}>
        {task.completed ? 'Descompletar' : 'Completar'}
      </button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  );
};
