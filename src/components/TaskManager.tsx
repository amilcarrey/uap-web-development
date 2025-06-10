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
import { useBoards } from "../hooks/useBoards";
import { useSettings } from "../context/settings-context";
 

const TaskManager: React.FC = () => {
  const [currentBoardId, setCurrentBoardId] = useState("0");
  const [newTaskText, setNewTaskText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { settings, toggleSettingsPage } = useSettings();
  
// manejo dinamico de los tableros

  const { data: boards, isLoading: loadingBoards, isError: errorBoards, addBoard, deleteBoard } = useBoards();

  const [ showNewBoardInput, setShowNewBoardInput ] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const { data, isLoading, isError, } = useTasks(filter, page, limit, currentBoardId, settings.refetchInterval);
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

    <nav className="flex justify-between w-full bg-[#e8af9695] p-6 rounded-md mt-60">
      <div className="flex justify-between w-full flex-grow">

        {loadingBoards && <p>Cargando tableros...</p>}
        {errorBoards && <p>Error cargando tableros</p>}
        {(boards?? []).map((board) => (
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
      </div>

      {/* Botón para agregar un nuevo tablero */}
      <button
        className="text-lg font-bold bg-[#f7cbb3] hover:bg-[#e49d89dc] px-3 rounded"
        onClick={() => setShowNewBoardInput(true)}
      >
        +
      </button>

      {/* Botón para eliminar el tablero seleccionado */}
      <button
        className="text-lg font-bold bg-red-200 hover:bg-red-400 px-3 rounded text-black"
        title="Eliminar tablero actual"
        onClick={() => {
          if (!currentBoardId || currentBoardId === "0") return;
          if (confirm("¿Estás seguro de que deseas eliminar este tablero?")) {
            deleteBoard(Number(currentBoardId));
            setCurrentBoardId("0");
          }
        }}
       >
        🗑
      </button>

    </nav>


       {showNewBoardInput && (
  <div className="flex items-center gap-2 mt-4">
    <input 
      type="text"
      placeholder="Nombre del nuevo tablero"
      className="border px-2 py-1 rounded"
      value={newBoardName}
      onChange={(e) => setNewBoardName(e.target.value)}
      autoFocus
    />
    <button
      className="bg-[#e49d89dc] px-4 py-2 rounded-md text-lg hover:bg-[#cc7a5a]"
      onClick={() => {
        if (!newBoardName.trim()) return;

        const board = {
          name: newBoardName.trim(),
          description: "Nuevo tablero.",
        };

        addBoard(board);
        setNewBoardName("");
        setShowNewBoardInput(false);
      }}
    >
      Agregar
    </button>
    <button
      className="text-red-500 hover:underline"
      onClick={() => {
        setShowNewBoardInput(false);
        setNewBoardName("");
      }}
    >
      Cancelar
    </button>
  </div>
)}


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
            uppercase={settings.uppercaseDescriptions}

          />
        )}
      </div>

        <div className="mt-6 flex items-center gap-4 justify-center">
        <ClearCompletedButton onClear={() => clearCompleted.mutate()} />
        
        {/* Botón tuerca */}
        <button
          onClick={toggleSettingsPage}
          title="Configuraciones"
          className="p-2 rounded hover:bg-gray-200"
         >
          <span style={{ fontSize: "15px" }}>⚙️</span>
        </button>
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
