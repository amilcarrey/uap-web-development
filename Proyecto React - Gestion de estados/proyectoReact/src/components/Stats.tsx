import { useTasks, type TaskFilter } from "../hooks/useTasks";

export function Stats({ filter }: { filter: TaskFilter }) {
  const { data: tasks } = useTasks(filter);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const incompleteTasks = totalTasks - completedTasks;

  return (
    <div className="stats">
      <div className="stat">
        <span>Total Tasks</span>
        <span>{totalTasks}</span>
      </div>
      <div className="stat">
        <span>Completed Tasks</span>
        <span>{completedTasks}</span>
      </div>
      <div className="stat">
        <span>Incomplete Tasks</span>
        <span>{incompleteTasks}</span>
      </div>
    </div>
  );
}