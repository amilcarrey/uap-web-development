import { NewTaskForm } from "./components/NewTaskForm";
import { TaskList } from "./components/TaskList";
import { useCallback, useEffect, useState } from "react";
import type { Task } from "./types";
import { FiltersForm } from "./components/FiltersForm";
import { ClearCompleted } from "./components/ClearCompleted";

const BASE_URL = "http://localhost:4321/api";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  const addTask = useCallback(
    async (text: string) => {
      const response = await fetch(`${BASE_URL}/agregar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data: Task = await response.json();
      setTasks((current) => [...current, data]);
    },
    [setTasks]
  );

  const toggleTask = async ( id: string ) => {
    const response = await fetch(`${BASE_URL}/completar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data: Task = await response.json();
    setTasks((current) =>
      current.map((item) =>
        item.id === data.id ? { ...item, done: data.done } : item
      )
    );
    filterTasks(filter);
  };

  const deleteTask = async ( id: string ) => {
    const response = await fetch(`${BASE_URL}/eliminar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const data: Task = await response.json();
    setTasks((current) =>
      current.filter((item) => item.id !== data.id)
    );
    filterTasks(filter);
  };
  
  const clearCompletedTasks = async () => {
    const response = await fetch(`${BASE_URL}/clear-completed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: Task[] = await response.json();
    setTasks(data);
  };

  const filterTasks = useCallback(
    async (filter: "all" | "completed" | "incomplete") => {
      const response = await fetch(`${BASE_URL}/filtros?filter=${filter}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Task[] = await response.json();
      setTasks(data);
    },
    [setTasks]
  );

  useEffect(() => {
    filterTasks(filter);
  }, [filter, filterTasks]);

  
  return (
    <>
      <header>
      {/* Título principal con un diseño simple donde "TO" y "DO" están separados para dar énfasis */}
        <h1 className="font-bold text-center text-[32px] text-[#333] my-4"><span className="text-[#e08e36]">TO</span>DO</h1>
      </header>

      {/* Barra de navegación con botones para diferentes categorías o acciones */}
      <nav className="flex justify-between bg-white p-2 border-b-[2px] border-[#ddd] w-full">
        {/* Botón para la categoría "Personal" */}
        <button className="border-none bg-transparent text-[18px] py-2 px-5 cursor-pointer font-bold border-b-[3px] border-orange">Personal</button>
        {/* Botón para la categoría "Professional" (sin clase) */}
        <button className="border-none bg-transparent text-[18px] py-3 px-5 cursor-pointer">Professional</button>
        {/* Botón para añadir nuevas tareas */}
        <button className="bg-[#b07c7c] text-white text-[20px] py-1 px-4 rounded-[5px] cursor-pointer">+</button>
      </nav>

      <FiltersForm filter={filter} setFilter={setFilter} />

      <main>
        {/* Agregar tarea */}
        <NewTaskForm addTask={addTask} />

        {/* Lista de tareas */}
        <TaskList
          tasks={(tasks ?? []).filter(task =>
            filter === "all"
            ? true
            : filter === "completed"
              ? task.done
              : !task.done
          )}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />

        {/* Botón para limpiar tareas completadas */}
        <ClearCompleted clearCompleted={clearCompletedTasks} />
      </main>
    </>
  );
}

export default App;