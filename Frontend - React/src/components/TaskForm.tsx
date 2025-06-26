import React from "react";
import { useSettings } from "../context/SettingsContext";

interface TaskFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSearch: () => void;  
  editingTaskId: number | null;
  setEditingTaskId: (id: number | null) => void;
  handleAddTask: (e: React.FormEvent) => void;
  selectedTableroId: number | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  inputText,
  setInputText,
  editingTaskId,
  setEditingTaskId,
  handleAddTask,
  selectedTableroId,
  handleSearch,  
}) => {
  const { settings } = useSettings();
  const theme = settings?.theme || "light";

  return (
    <section
      className={`p-6 rounded-lg mx-6 mb-6 transition shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-orange-100 text-black"
      }`}
    >
      <form onSubmit={handleAddTask} className="flex gap-4">
        <input
          type="text"
          placeholder={
            selectedTableroId === null
              ? "Selecciona un tablero primero"
              : "¿Qué tarea necesitas hacer?"
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
            }
          }}
          required
          disabled={selectedTableroId === null}
          className={`flex-1 p-3 rounded border text-lg ${
            theme === "dark"
              ? "border-gray-600 bg-gray-200 text-black"
              : "border-gray-300 bg-orange-100 text-black"
          } ${
            selectedTableroId === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        {editingTaskId !== null ? (
          <>
            <button
              type="submit"
              disabled={selectedTableroId === null}
              className={`px-6 py-3 rounded text-black ${
                selectedTableroId === null
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-300 hover:bg-green-400"
              }`}
            >
              💾
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingTaskId(null);
                setInputText("");
              }}
              className={`px-6 py-3 rounded ${
                theme === "dark"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-300 hover:bg-red-400 text-black"
              }`}
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              disabled={selectedTableroId === null}
              className={`px-6 py-3 rounded ${
                selectedTableroId === null
                  ? "bg-gray-300 cursor-not-allowed text-black"
                  : theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-300 hover:bg-blue-400 text-black"
              }`}
            >
              Añadir
            </button>

            <button
              type="button"
              onClick={handleSearch}
              disabled={selectedTableroId === null}
              className={`px-6 py-3 rounded ${
                selectedTableroId === null
                  ? "bg-gray-300 cursor-not-allowed text-black"
                  : theme === "dark"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-yellow-300 hover:bg-yellow-400"
              }`}
            >
              🔍
            </button>
          </>
        )}
      </form>
    </section>
  );
};

export default TaskForm;
