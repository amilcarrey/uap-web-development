import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "incomplete";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // Agregar tarea
  const addTask = () => {
    if (input.trim() === "") return;
    const newTask: Task = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  // Enter = agregar tarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  // Cambiar estado de completado
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Eliminar tarea
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Eliminar tareas completadas
  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  // Filtrar tareas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f9f5ef] flex flex-col items-center">
      <header className="w-full bg-[#f5f5fa] py-6 text-center shadow">
        <h1 className="text-3xl font-bold">
          TO<span className="text-orange-500">DO</span>
        </h1>
        <div className="mt-2 flex justify-center gap-6">
          <button className="font-semibold">Personal</button>
          <button className="font-semibold">Professional</button>
          <button className="text-white bg-rose-400 rounded-full w-6 h-6 flex items-center justify-center font-bold">
            +
          </button>
        </div>
      </header>

      <main className="w-full max-w-xl bg-white mt-10 rounded-lg shadow-md p-6">
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow border border-gray-300 rounded px-3 py-2"
            placeholder="¿Qué tarea necesitas hacer?"
          />
          <button
            onClick={addTask}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            ADD
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1 rounded ${
              filter === "all"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("incomplete")}
            className={`px-4 py-1 rounded ${
              filter === "incomplete"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Incomplete
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-1 rounded ${
              filter === "completed"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Complete
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span
                  className={`${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500"
              >
                🗑
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-right">
          <button
            onClick={clearCompleted}
            className="text-orange-500 hover:underline"
          >
            Clear Completed
          </button>
        </div>
      </main>
    </div>
  );
}