import { TaskItem } from "../components/TaskItem";
import { useTasks } from "../hooks/tasks/useTasks";
import { Pagination } from "../components/Pagination";

export const TaskList = () => {
  const { data, isLoading, isError } = useTasks();

  if (isLoading) return <p className="text-center py-8">Loading...</p>;
  if (isError) return <p className="text-center py-8 text-red-500">Error loading tasks</p>;
  if (!data || data.tasks.length === 0) return <p className="text-center py-8">No tasks</p>;

  return (
    <>
      <ul>
        {data.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
      <Pagination total={data.total} />
    </>
  );
};