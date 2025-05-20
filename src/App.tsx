
import { useEffect, useState } from "react";
import {fetchTareas,addTarea,toggleTarea,deleteTarea,clearCompletadas,clearAll,} from "./api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";

type Tarea = {
  id: number;
  text: string;
  completada: boolean;
};

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState("all");

  const cargar = async (f = filtro) => {
    const data = await fetchTareas(f);
    setTareas(data);
  };

  useEffect(() => {
    cargar();
  }, [filtro]);

  const agregar = async (text: string) => {
    await addTarea(text);
    cargar();
  };

  const toggle = async (id: number) => {
    await toggleTarea(id);
    cargar();
  };

  const eliminar = async (id: number) => {
    await deleteTarea(id);
    cargar();
  };

  const borrarCompletadas = async () => {
    await clearCompletadas(); 
    cargar();
  };
  const borrartodo  = async () => {
    await clearAll();
    cargar();
  };
  

 return (
    <div className="bg-gray-0 min-h-screen">
      {/* Encabezado */}
      <header className="bg-blue-500 text-white w-full py-5 text-center">
        <h1 className="text-2xl font-bold">APP TAREAS :)</h1>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md">
          {/* Modo Personal/Profesional (solo visual) */}
          <div className="flex justify-center mb-5 bg-white p-3 gap-10">
            <button className="font-bold text-blue-500 px-4 py-1 border-b-2 border-blue-600" disabled>Personal</button>
            <button className="font-bold text-blue-500 px-4 py-1" disabled>Profesional</button>
          </div>

          {/* Formulario para agregar tarea */}
          <div className="bg-white p-4 rounded-lg shadow flex items-center w-full mb-6">
            <TaskForm onAdd={agregar} />
          </div>

          {/* Contenedor de tareas */}
          <section className="bg-white p-7 rounded-lg shadow w-full">
            <Filters filtro={filtro} onChange={setFiltro} />
            <div className="mt-5">
              <TaskList tareas={tareas} onToggle={toggle} onDelete={eliminar} />
            </div>
          </section>

          {/* Botones de borrar */}
          <div className="flex justify-between mt-4 px-2">
            <button
              onClick={borrarCompletadas}
              className="text-blue-500 hover:underline"
            >
              Borrar completadas
            </button>
            <button
              onClick={borrartodo}
              className="text-blue-500 hover:underline"
            >
              Borrar todo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


export default App;
