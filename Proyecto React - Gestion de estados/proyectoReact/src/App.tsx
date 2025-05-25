import { NewTaskForm } from "./components/NewTaskForm";
import { TaskList } from "./components/TaskList";
import { useEffect, useState } from "react";
import type { Task } from "./types";
import { FiltersForm } from "./components/FiltersForm";
import { ClearCompleted } from "./components/ClearCompleted";
import { Stats } from "./components/Stats";


function App() {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");

  
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
      {/* <Stats filter={filter} /> */}

      <main>
        {/* Agregar tarea */}
        <NewTaskForm filter={filter} />

        {/* Lista de tareas */}
        <TaskList filter={filter} />

        {/* Botón para limpiar tareas completadas */}
        <ClearCompleted filter={filter} />
      </main>
    </>
  );
}

export default App;