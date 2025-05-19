import { useCallback, useEffect, useState } from "react";
import { FilterForm } from "./components/FilterForm";
import { NuevaTareaForm } from "./components/NuevaTareaForm";
import { TareaList } from "./components/TareaList";
import type { Tarea } from "./types";

const BASE_URL = "http://localhost:5173/api";

function ToDoApp() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filtro, setFiltro] = useState("todas");

  const fetchTareas = useCallback(async () => {
    const res = await fetch('${BASE_URL}/listar');
    const data = await res.json();
    setTareas(data.tareas || []);
  }, []);

  useEffect(() => {
    fetchTareas();
  }, [fetchTareas]);

  const agregarTarea = async (texto: string) => {
    const formData = new FormData();
    formData.append("texto", texto);

    const res = await fetch('${BASE_URL}/agregar', {
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

    const res = await fetch('${BASE_URL}/eliminar', {
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
    const formData = new FormData();
    formData.append("index", index.toString());

    const res = await fetch('${BASE_URL}/toggle', {
      method: "POST",
      body: formData,
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
    const res = await fetch('${BASE_URL}/limpiar', {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      setTareas((prev) => prev.filter((t) => !t.completada));
    }
  };

  const tareasFiltradas = tareas.filter((t) =>
    filtro === "completadas"
      ? t.completada
      : filtro === "incompletas"
      ? !t.completada
      : true
  );

  return (
    <section className="max-w-2xl mx-auto p-4 space-y-4 border rounded-lg shadow bg-white">
      <FilterForm
        filtro={filtro}
        setFiltro={setFiltro}
      />
      <NuevaTareaForm agregarTarea={agregarTarea} />
      <TareaList
        tareas={tareasFiltradas}
        eliminarTarea={eliminarTarea}
        toggleTarea={toggleTarea}
      />
      <button
        onClick={limpiarCompletadas}
        className="text-red-600 text-sm hover:underline"
      >
        Limpiar completadas
      </button>
    </section>
  );
}

export default ToDoApp;
