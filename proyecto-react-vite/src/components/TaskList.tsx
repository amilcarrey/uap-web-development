import { useTaskStore } from "../state/taskStore";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { tasks, filter } = useTaskStore();
  const clearCompleted = useTaskStore((s) => s.clearCompleted);

  const filteredTasks = tasks.filter((t) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? t.completed
      : !t.completed
  );

  return (
    <>
      <ul className="flex flex-col items-center gap-4 bg-orange-100 w-1/2 p-4 rounded">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>

      {tasks.some((t) => t.completed) && (
        <button
          onClick={clearCompleted}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4"
        >
          Eliminar todas las completadas
        </button>
      )}
    </>
  );
}
