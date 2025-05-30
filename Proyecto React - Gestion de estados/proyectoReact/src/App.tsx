import type { Task } from './types';
import { ToastContainer } from "./components/ToastContainer";
import { NewTaskForm } from "./components/NewTaskForm";
import { TaskList } from "./components/TaskList";
import { useEffect, useState } from "react";
import { FiltersForm } from "./components/FiltersForm";
import { ClearCompleted } from "./components/ClearCompleted";
import { useFilterStore } from "./store/useFilterStore";


function App() {
  const filter = useFilterStore((state) => state.filter);
  const setFilter = useFilterStore((state) => state.setFilter);
  const [page, setPage] = useState(1);
  const [taskEditing, setTaskEditing] = useState<Task | null>(null);

  useEffect(() => {
    setPage(1); // Reset page to 1 when filter changes
  }, [filter]);

  
  return (
    <>
      <ToastContainer />
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

      <FiltersForm />
      {/* <Stats filter={filter} /> */}

      <main>
        {/* Agregar tarea */}
        <NewTaskForm page={page} setPage={setPage} taskEditing={taskEditing} setTaskEditing={setTaskEditing} />

        {/* Lista de tareas */}
        <TaskList page={page} setPage={setPage} setTaskEditing={setTaskEditing} />

        {/* Botón para limpiar tareas completadas */}
        <ClearCompleted />
      </main>
    </>
  );
}

export default App;