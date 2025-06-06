//  logica principal donde se maneja el estado, efectos y llamadas a la api
import { useState } from "react";
import type { Filter } from "../type";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import TaskFilters from "./TaskFilters";
import ClearCompletedButton from "./ClearCompletedButton";
import { useTasks } from "../hooks/useTasks";
import { useTaskActions } from "../hooks/useTaskActions";
import { Toaster } from "react-hot-toast";

const allBoards = [
  {
    id: "0",
    name: "Personal",
    description: "This is the default board.",
  },
  {
    id: "1",
    name: "Profesional",
    description: "This is the professional board.",
  },
];

const TaskManager: React.FC = () => {
  const [currentBoardId, setCurrentBoardId] = useState("0");
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data, isLoading, isError } = useTasks(filter, page, limit, currentBoardId);
  const tasks = data?.tasks ?? [];
  const totalPages = data?.totalPages ?? 1;

  const {
    addTask,
    completeTask,
    deleteTask,
    clearCompleted,
  } = useTaskActions();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    addTask.mutate(
      { taskText: newTaskText.trim(), tableroId: currentBoardId },
      {
        onSuccess: () => setNewTaskText(""),
      }
    );
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#f0f0f0",
            color: "#000",
            fontSize: "16px",
          },
        }}
      />

      <header className="text-center bg-[#e49d89dc] p-6 rounded-md mt-4">
        <h1 className="text-4xl font-bold text-black">Gestor de tareas</h1>
      </header>

      <nav className="flex justify-around bg-[#e8af9695] p-6 rounded-md mt-6">
        {allBoards.map((board) => (
          <div
            key={board.id}
            className={`text-lg cursor-pointer ${
              currentBoardId === board.id
                ? "border-b-4 border-[#e08123] font-semibold"
                : "hover:border-b-4 border-transparent"
            }`}
            onClick={() => {
              setCurrentBoardId(board.id);
              setPage(1);
            }}
          >
            {board.name}
          </div>
        ))}
      </nav>

      <div className="flex items-center justify-between p-4 bg-white rounded-md mt-6">
        <TaskForm
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onSubmit={handleAddTask}
        />
      </div>

      <div className="max-w-[900px] mx-auto rounded-lg p-6 text-center mt-6 bg-[#fefefe] shadow">
        {isLoading ? (
          <p>Cargando tareas...</p>
        ) : isError ? (
          <p>Error cargando tareas</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={(id) => completeTask.mutate(id)}
            onDelete={(id) => deleteTask.mutate(id)}
          />
        )}
      </div>

      <div className="mt-6">
        <ClearCompletedButton onClear={() => clearCompleted.mutate()} />
      </div>

      <div className="mt-6 mb-8">
        <TaskFilters
          currentFilter={filter}
          onChange={(newFilter) => {
            setFilter(newFilter);
            setPage(1);
          }}
        />
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-md bg-[#e8af9695] hover:bg-[#d89e7c]"
          >
            ⬅ Anterior
          </button>
        )}
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-md ${
              page === i + 1 ? "bg-[#a8c99e] text-white" : "bg-[#e8af9695] hover:bg-[#d89e7c]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-md bg-[#e8af9695] hover:bg-[#d89e7c]"
          >
            Siguiente ➡
          </button>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <form className="flex items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="limit" className="text-gray-700">
            Ingrese las tareas por página:
          </label>
          <input
            type="number"
            name="limit"
            id="limit"
            min="1"
            value={limit}
            className="px-2 py-1 border border-gray-300 rounded-md w-20"
            placeholder="Ej: 5"
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          />
        </form>
      </div>
    </>
  );
};

export default TaskManager;
