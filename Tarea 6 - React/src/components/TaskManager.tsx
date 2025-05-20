import React, { useEffect, useState } from "react";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

type FilterOption = "all" | "done" | "undone";

const API_URL = "http://localhost:4321";

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentFilter, setCurrentFilter] = useState<FilterOption>("all");

  // Función para obtener tareas según el filtro actual
  const loadTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks?filter=${currentFilter}`);
      const result = await response.json();
      setTasks(result.tasks);
    } catch (error) {
      console.error("Error al cargar las tareas:", error);
    }
  };

  // Carga las tareas cada vez que cambia el filtro
  useEffect(() => {
    loadTasks();
  }, [currentFilter]);

  // Añadir una tarea nueva
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: trimmedText }),
      });
      const data = await response.json();
      setTasks(prev => [...prev, data.task]);
      setInputText("");
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // Cambiar estado de completado
  const toggleTaskCompletion = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      const data = await response.json();
      setTasks(prev => prev.map(task => (task.id === id ? data.task : task)));
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // Eliminar una tarea
  const removeTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Limpiar todas las tareas completadas
  const clearCompletedTasks = async () => {
    try {
      await fetch(`${API_URL}/api/tasks/clear-completed`, {
        method: "POST",
      });
      setTasks(prev => prev.filter(task => !task.completed));
    } catch (error) {
      console.error("Error al limpiar tareas completadas:", error);
    }
  };

  // Estilos para los botones de filtro
  const filterStyles: Record<FilterOption, { border: string; text: string; bg: string }> = {
    all: {
      border: "border-[#ca8a04]",
      text: "text-[#78350f]",
      bg: "bg-[#f9fafb]",
    },
    done: {
      border: "border-[#2563eb]",
      text: "text-[#1e40af]",
      bg: "bg-[#bfdbfe]",
    },
    undone: {
      border: "border-[#dc2626]",
      text: "text-[#991b1b]",
      bg: "bg-[#fecaca]",
    },
  };

  return (
    <>
      <header className="sticky top-0 bg-[#fef5e7] p-6 rounded-md z-50 text-center">
        <h1 className="text-4xl font-bold text-black">Buscador de Messis - Tareas React</h1>
      </header>

      <section className="flex justify-center my-6 relative z-0">
        <img
          src="https://www.fifpro.org/media/ovzgbezo/messi_w11_2024.jpg"
          alt="Lionel Messi"
          className="scale-90 max-w-full rounded-xl shadow-lg hover:scale-95 transition-transform duration-300"
        />
      </section>

      <nav className="flex justify-around bg-[#fef5e7] p-6 rounded-md mt-4">
        <div className="text-lg cursor-pointer hover:border-b-4 border-[#23cde0]">Personal</div>
        <div className="text-lg cursor-pointer hover:border-b-4 border-[#23cde0]">Profesional</div>
      </nav>

      <section className="flex items-center justify-between p-4 bg-orange-100 rounded-md mt-4">
        <form onSubmit={handleAddTask} className="flex w-full">
          <input
            type="text"
            placeholder="¿Qué tarea necesitas hacer?"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            required
            className="flex-grow p-3 ml-2 bg-orange-100"
          />
          <button
            type="submit"
            className="bg-[#a8c99e] text-white px-6 py-3 rounded-md hover:bg-[#88c874]"
          >
            Añadir
          </button>
        </form>
      </section>

      <main className="max-w-[900px] mx-auto rounded-lg p-6 text-center mt-4 bg-white">
        <ul className="list-none p-0">
          {tasks.map(({ id, text, completed }) => (
            <li
              key={id}
              className="task-item flex justify-between bg-white p-4 rounded-md shadow-md mb-3"
            >
              <button
                type="button"
                className="text-xl"
                onClick={() => toggleTaskCompletion(id)}
                aria-label={completed ? "Marcar como pendiente" : "Marcar como completada"}
              >
                {completed ? "🔄" : "✔️"}
              </button>

              <span
                className={`mx-4 flex-grow ${
                  completed ? "line-through opacity-50 text-gray-500" : "text-gray-800"
                }`}
              >
                {text}
              </span>

              <button
                type="button"
                onClick={() => removeTask(id)}
                className="text-xl"
                aria-label="Eliminar tarea"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </main>

      <section className="text-center mt-4">
        <button
          onClick={clearCompletedTasks}
          className="bg-[#bfdbfe] px-6 py-3 rounded text-lg hover:bg-[#93c5fd] transition"
        >
          Eliminar completadas
        </button>
      </section>

      <footer className="flex justify-center mt-4">
        <div className="flex space-x-4">
          {(["all", "done", "undone"] as FilterOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setCurrentFilter(option)}
              className={`${filterStyles[option].border} ${filterStyles[option].text} ${filterStyles[option].bg} text-lg rounded px-3 py-1`}
            >
              {option === "all"
                ? "Todas"
                : option === "done"
                ? "Completas"
                : "Incompletas"}
            </button>
          ))}
        </div>
      </footer>
    </>
  );
};

export default TaskManager;
