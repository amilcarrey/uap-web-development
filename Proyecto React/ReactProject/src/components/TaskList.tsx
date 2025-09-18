import type { Task } from '../types';
import { TaskItem } from './TaskItem.tsx';

type TaskItemProps = {
  tasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

export function TaskList({
  tasks,
  toggleTask,
  deleteTask
}: TaskItemProps) {
  return (
    <ul className="list-none mx-auto max-w-xl bg-[#e4dfd9] rounded-[10px] p-[20px]" id="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task?.id}
          task={task}
          toggleTask={() => toggleTask(task.id)}
          deleteTask={() => deleteTask(task.id)}
        />
      ))}
    </ul>
  );
}