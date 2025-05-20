import "./App.css";
import { FilterForm } from "./components/Filtros";
import { NuevaTareaForm } from "./components/TareaNueva";
import { ListaTareas } from "./components/ListaTarea";
import { useCallback, useEffect, useState } from "react";
import type { Tarea } from "./types/tarea";
import { useDebounce } from "./utils/useDebounce";

const BASE_URL = "http://localhost:4321/api";

function App() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const addTarea = useCallback(
    async (texto: string) => {
      if (!texto.trim()) return; // valida que no sea vacío
      const response = await fetch(`${BASE_URL}/tareas`, {
        method: "POST",
        body: JSON.stringify({ texto }),
        headers: { "Content-Type": "application/json" },
      });
      const data: { tarea: Tarea } = await response.json();
      setTareas((current) => [...current, data.tarea]);
    },
    [setTareas]
  );

  const toggleCompletar = async (id: string) => {
    const response = await fetch(`${BASE_URL}/tareas/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "toggle" }),
      headers: { "Content-Type": "application/json" },
    });
    const data: { tarea: Tarea } = await response.json();
    setTareas((current) =>
      current.map((tarea) =>
        tarea.id === data.tarea.id ? { ...tarea, completed: data.tarea.completed } : tarea
      )
    );
  };

  const removeTarea = async (id: string) => {
    const response = await fetch(`${BASE_URL}/tareas/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "delete" }),
      headers: { "Content-Type": "application/json" },
    });
    const data: { tarea: Tarea } = await response.json();
    setTareas((current) => current.filter((t) => t.id !== data.tarea.id));
  };

  const clearCompletadas = async () => {
    const response = await fetch(`${BASE_URL}/tareas`, {
      method: "DELETE",
    });
    const data: { tareas: Tarea[] } = await response.json();
    setTareas(data.tareas);
  };

  useEffect(() => {
    const fetchTareas = async () => {
      const response = await fetch(`${BASE_URL}/tareas?search=${debouncedSearch}`);
      const data: { tareas: Tarea[] } = await response.json();
      setTareas(data.tareas);
    };
    fetchTareas();
  }, [debouncedSearch]);

  // Filtra las tareas según el filtro seleccionado
  const tareasFiltradas = tareas.filter((tarea) => {
    if (filter === "completed") return tarea.completed;
    if (filter === "incomplete") return !tarea.completed;
    return true; // all
  });

  return (
    <>
      <header className="encabezado">TO - DO</header>

      <div className="container">
        <h4 id="subencabezado">Personal</h4>
        <h4 id="subencabezado">Professional</h4>
      </div>

      <div className="buscador">
        <NuevaTareaForm addTarea={addTarea} />
      </div>

      <div className="filtros">
        <FilterForm
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      <div className="to-do">
        <ListaTareas
          tareas={tareasFiltradas}
          toggleCompletar={toggleCompletar}
          removeTarea={removeTarea}
        />

        {tareas.some((t) => t.completed) && (
          <button className="clear-completed" onClick={clearCompletadas}>
            Clear Completed
          </button>
        )}
      </div>
    </>
  );
}

export default App;
