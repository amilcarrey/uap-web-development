import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskFilters } from "./components/TaskFilters";
import { ClearCompletedButton } from "./components/ClearCompletedButton";
import type { Tarea } from "./types";

const BASE_URL = "http://localhost:5173/api";

type Filter = "all" | "active" | "completed";

function App() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tareas`);
        const text = await response.text();
        if (!text) {
          console.error("El backend no devolvió ninguna tarea.");
          return;
        }
        const data = JSON.parse(text);
        setTareas(data.tareas || []);
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };
    fetchTareas();
  }, []);

  const addTarea = useCallback(async (texto: string) => {
    try {
      const response = await fetch(`${BASE_URL}/tareas`, {
        method: "POST",
        body: JSON.stringify({ texto }),
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text();
      if (!text) {
        console.error("El servidor no devolvió una respuesta válida.");
        return;
      }

      const data = JSON.parse(text);
      if (!data || !data.tarea) {
        console.error("El backend no devolvió una tarea correctamente.");
        return;
      }

      setTareas((actuales) => [...actuales, data.tarea]);
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  }, []);

  const eliminarTarea = useCallback(async (id: string) => {
    try {
      await fetch(`${BASE_URL}/tareas/${id}`, { method: "DELETE" });
      setTareas((actuales) => actuales.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  }, []);

  const toggleCompletada = useCallback(async (id: string) => {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;

    try {
      const response = await fetch(`${BASE_URL}/tareas/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completada: !tarea.completada }),
        headers: { "Content-Type": "application/json" },
      });

      const text = await response.text();
      if (!text) {
        console.error("El backend no devolvió datos actualizados.");
        return;
      }

      const data = JSON.parse(text);
      setTareas((actuales) => actuales.map((t) => (t.id === id ? data.tarea : t)));
    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  }, [tareas]);

  const tareasFiltradas = tareas.filter((tarea) => {
    if (filter === "active") return !tarea.completada;
    if (filter === "completed") return tarea.completada;
    return true;
  });

  const hasCompleted = tareas.some((t) => t.completada);

  const clearCompleted = useCallback(async () => {
    try {
      const completedIds = tareas.filter((t) => t.completada).map((t) => t.id);

      await Promise.all(
        completedIds.map((id) => fetch(`${BASE_URL}/tareas/${id}`, { method: "DELETE" }))
      );

      setTareas((actuales) => actuales.filter((t) => !t.completada));
    } catch (error) {
      console.error("Error eliminando tareas completadas:", error);
    }
  }, [tareas]);

  return (
    <main className="min-h-screen text-gray-100 flex flex-col items-center p-10">
      <section className="w-full max-w-xl rounded-lg border border-gray-700 bg-gray-800 bg-opacity-40 p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-indigo-400">Agregar tarea</h1>
        <TaskForm onAddTask={addTarea} />
        <TaskFilters filter={filter} setFilter={setFilter} />
        <TaskList tareas={tareasFiltradas} eliminarTarea={eliminarTarea} toggleCompletada={toggleCompletada} />
        <ClearCompletedButton onClearCompleted={clearCompleted} hasCompleted={hasCompleted} />
      </section>
    </main>
  );
}

export default App;