import React from "react";

interface TaskFormProps {
  inputText: string;
  setInputText: (text: string) => void;
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
}) => {
  return (
    <section className="bg-orange-100 dark:bg-gray-800 dark:text-white p-6 rounded-lg mx-6 mb-6 transition shadow-md">
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
          required
          disabled={selectedTableroId === null}
          className={`flex-1 p-3 rounded border border-gray-300 dark:border-gray-600 bg-orange-100 dark:bg-gray-200 text-lg text-black dark:text-black 
            ${
              selectedTableroId === null
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
        />

        {editingTaskId !== null ? (
          <>
            <button
              type="submit"
              disabled={selectedTableroId === null}
              className={`px-6 py-3 rounded text-black
                ${
                  selectedTableroId === null
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-300 hover:bg-green-400"
                }
              `}
            >
              💾
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingTaskId(null);
                setInputText("");
              }}
              className="bg-red-300 hover:bg-red-400 text-black px-6 py-3 rounded"
            >
              ❌
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={selectedTableroId === null}
            className={`px-6 py-3 rounded text-black
              ${
                selectedTableroId === null
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-300 hover:bg-blue-400"
              }
            `}
          >
            Añadir
          </button>
        )}
      </form>
    </section>
  );
};

export default TaskForm;