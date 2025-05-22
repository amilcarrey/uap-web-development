import { useCallback, useEffect, useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { NuevaTareaForm } from "./components/NuevaTareaForm";
import { TareaList } from "./components/TareaList";
import { ClearCompleted } from "./components/ClearCompleted";

import type { Tarea } from "./types";

const BASE_URL = "http://localhost:4321/api";

function ToDoApp() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState("todas");

  const fetchTareas = useCallback(async () => {
    const res = await fetch(`${BASE_URL}/listar`);
    const data = await res.json();
    setTareas(data.tareas || []);
  }, []);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const agregarTarea = async (texto: string) => {
    const formData = new FormData();
    formData.append("texto", texto);

    const res = await fetch(`${BASE_URL}/agregar`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setTareas((prev) => [...prev, data.tarea]);
    }
  };

  const eliminarTarea = async (index: number) => {
    const formData = new FormData();
    formData.append("index", index.toString());

    const res = await fetch(`${BASE_URL}/eliminar`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    if (data.success) {
      setTareas((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const toggleTarea = async (index: number) => {
    // const formData = new FormData();
    // formData.append("index", index.toString());

    const res = await fetch(`${BASE_URL}/toggle/${index}`, {
      method: "POST",
      //body: formData,
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      setTareas((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, completada: !t.completada } : t
        )
      );
    }
  };

  const limpiarCompletadas = async () => {
    const res = await fetch(`${BASE_URL}/limpiar`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    
    if (res.ok) {
    // éxito: actualiza la lista en el cliente
    setTareas((prev) => prev.filter((t) => !t.completada));
  }

    // const data = await res.json();
    // if (data.success) {
    //   setTareas((prev) => prev.filter((t) => !t.completada));
    // }
  };

  const tareasFiltradas = tareas.filter((t) =>
    filtro === "completadas"
      ? t.completada
      : filtro === "incompletas"
      ? !t.completada
      : true
  );
  const hasCompleted = tareas.some((t) => t.completada);
  
  // return (
  //   <section className="max-w-2xl mx-auto p-4 space-y-4 border rounded-lg shadow bg-white">
  //     <FilterForm
  //       filtro={filtro}
  //       setFiltro={setFiltro}
  //     />
      
  //     <NuevaTareaForm agregarTarea={agregarTarea} />
      
  //     <TareaList
  //       tareas={tareasFiltradas}
  //       eliminarTarea={eliminarTarea}
  //       toggleTarea={toggleTarea}
  //     />
  //     {/* <button
  //       onClick={limpiarCompletadas}
  //       className="text-red-600 text-sm hover:underline"
  //     >
  //       Limpiar completadas
  //     </button> */}
  //     <ClearCompleted
  //       tareas={tareas}
  //       clearCompleted={limpiarCompletadas}
  //     />
  //   </section>
  // );

  return (
  <section className="min-h-screen bg-[#f5f1eb] flex items-start justify-center pt-10">
    <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 space-y-6">
      {/* Título bonito */}
      <h1 className="text-4xl font-bold text-center">
        <span className="text-pink-400">TO</span>
        <span className="text-slate-800">DO</span>
      </h1>

      {/* Filtros */}
      <FilterForm filtro={filtro} setFiltro={setFiltro} />

      {/* Input + botón agregar */}
      <NuevaTareaForm agregarTarea={agregarTarea} />

      {/* Lista */}
      <TareaList
        tareas={tareasFiltradas}
        eliminarTarea={eliminarTarea}
        toggleTarea={toggleTarea}
      />

      {/* Clear Completed */}
      <ClearCompleted tareas={tareas} clearCompleted={limpiarCompletadas} />
    </div>
  </section>
);

}

export default ToDoApp;
