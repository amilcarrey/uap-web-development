import React, { useState } from "react";
import Header from "./components/Header";
import ListaTareas from "./components/ListaTareas";

type Tarea = {
  texto: string;
  completada: boolean;
};

const App = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "activas" | "completadas">(
    "todas"
  );
  const [texto, setTexto] = useState("");

  const tareasFiltradas = tareas.filter((t) =>
    filtro === "activas"
      ? !t.completada
      : filtro === "completadas"
      ? t.completada
      : true
  );

  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setTareas([...tareas, { texto: texto.trim(), completada: false }]);
    setTexto("");
  };

  const toggleCompletada = (index: number) => {
    const nuevas = [...tareas];
    nuevas[index].completada = !nuevas[index].completada;
    setTareas(nuevas);
  };

  const eliminarTarea = (index: number) => {
    setTareas(tareas.filter((_, i) => i !== index));
  };

  const limpiarCompletadas = () => {
    const confirmar = confirm(
      "¿Seguro que querés eliminar todas las tareas completadas?"
    );
    if (!confirmar) return;
    setTareas(tareas.filter((t) => !t.completada));
  };

  return (
    <div className="w-full flex justify-center px-4 float-center">
      <Header filtro={filtro} setFiltro={setFiltro} />

      <main className="w-full flex justify-center mt-[120px] px-4 align-center">
      <div className="tareas w-full max-w-xl mx-auto mt-8 p-4 float-center">
          <div className="contenedor-form flex justify-center items-center mb-8 w-full">
            <form
              onSubmit={agregarTarea}
              className="flex justify-center items-center gap-0 max-w-xl w-full"
            >
              <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="¿Qué necesitas hacer?"
                required
                className="rounded h-16 border-none w-[90%] pl-4 bg-gray-200 placeholder-gray-700 text-black"
              />
            </form>
          </div>

          <ListaTareas
            tareas={tareasFiltradas}
            onToggle={toggleCompletada}
            onDelete={eliminarTarea}
            onClearCompleted={limpiarCompletadas}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
