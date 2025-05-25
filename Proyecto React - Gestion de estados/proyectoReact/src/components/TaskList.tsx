import { useTasks } from '../hooks/useTasks.tsx';
import { TaskItem } from './TaskItem.tsx';
import type { TaskFilter } from '../hooks/useTasks.tsx';

type TaskItemProps = {
  filter: TaskFilter;
};

export function TaskList({ filter }: TaskItemProps) {
  const { data: tasks, isLoading, isError } = useTasks(filter);

  // if (isLoading) return <p className="text-center text-[20px]">Loading...</p>;
  // if (isError) return <p className="text-center text-[20px]">Error loading tasks</p>;
  
  return (
    <ul className="list-none mx-auto max-w-xl bg-[#e4dfd9] rounded-[10px] p-[20px]" id="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} filter={filter} />
      ))}
    </ul>
  );
}