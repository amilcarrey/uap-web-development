import { useParams, Link } from "@tanstack/react-router";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { TaskFilters } from "./TaskFilters";

export const TaskBoard = () => {
  const { boardId, name } = useParams({ from: "/board/$boardId/$name" });

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mx-auto max-w-md">
      <Link to="/" className="text-blue-500 mb-4 block">
        ← Volver a tableros
      </Link>
      <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
        Tablero #{boardId} -{name}
      </h1>
      <TaskForm boardId={parseInt(boardId)} />
      <TaskFilters />
      <TaskList boardId={parseInt(boardId)} />
    </div>
  );
};
