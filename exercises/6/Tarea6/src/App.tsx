// Importa React y los hooks useEffect y useState desde la biblioteca de React
import React, { useEffect, useState } from "react";

// Importa los componentes personalizados que se utilizarán en la aplicación
import NuevaTareaInput from "./components/NuevaTareaInput";
import TareaList from "./components/TareaList";
import Filtros from "./components/Filtros";

// Define la interfaz Tarea para tipar los objetos de tareas
interface Tarea {
  id: number | string; // Identificador único de la tarea
  title: string;       // Título o descripción de la tarea
  completed: boolean;  // Estado de completitud de la tarea
}

// Define la URL base de la API para las tareas
const API_URL = "http://localhost:4321/api/tareas";

// Define el componente principal de la aplicación como una función de React
const App: React.FC = () => {
  // Define el estado 'tareas' como un arreglo de objetos Tarea
  const [tareas, setTareas] = useState<Tarea[]>([]);

  // Define el estado 'filtro' para controlar el filtro de tareas mostradas
  const [filtro, setFiltro] = useState<"all" | "completed" | "incomplete">("all");

  // useEffect se ejecuta una vez al montar el componente para cargar las tareas desde la API
  useEffect(() => {
    // Realiza una solicitud GET a la API para obtener las tareas
    fetch(API_URL)
      .then((res) => res.json()) // Convierte la respuesta a JSON
      .then((data) => {
        // Verifica si la respuesta contiene un arreglo de tareas
        if (Array.isArray(data.tareas)) {
          // Mapea las tareas recibidas adaptando las propiedades al formato esperado
          const tareasAdaptadas = data.tareas.map((t: any) => ({
            id: t.id,
            title: t.content, // Adapta 'content' del backend a 'title' del frontend
            completed: t.completed,
          }));
          console.log("Tareas cargadas:", tareasAdaptadas); // Muestra las tareas en la consola
          setTareas(tareasAdaptadas); // Actualiza el estado con las tareas adaptadas
        } else {
          console.error("Respuesta inválida del servidor:", data); // Muestra un error si la respuesta no es válida
          setTareas([]); // Establece el estado de tareas como un arreglo vacío
        }
      })
      .catch((error) => {
        console.error("Error al cargar tareas:", error); // Muestra un error si la solicitud falla
        setTareas([]); // Establece el estado de tareas como un arreglo vacío
      });
  }, []); // El arreglo vacío como dependencia asegura que se ejecute solo una vez al montar

  // Función para agregar una nueva tarea
  const agregarTarea = async (title: string) => {
    if (!title.trim()) return; // Si el título está vacío o solo contiene espacios, no hace nada
    try {
      // Realiza una solicitud POST a la API para agregar una nueva tarea
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido como JSON
        body: JSON.stringify({ content: title, completed: false }), // Envía el contenido de la tarea y su estado inicial
      });

      if (!res.ok) throw new Error("Error al agregar tarea"); // Lanza un error si la respuesta no es exitosa

      const data = await res.json(); // Convierte la respuesta a JSON
      const tareaBackend = data.tarea; // Extrae la tarea creada del backend

      // Crea un nuevo objeto Tarea adaptando las propiedades del backend
      const nuevaTarea: Tarea = {
        id: tareaBackend.id,
        title: tareaBackend.content || tareaBackend.title, // Usa 'content' o 'title' según esté disponible
        completed: tareaBackend.completed,
      };

      setTareas((prev) => [...prev, nuevaTarea]); // Agrega la nueva tarea al estado existente
    } catch (error) {
      console.error("Error al agregar tarea:", error); // Muestra un error si la solicitud falla
    }
  };

  // Función para alternar el estado de completitud de una tarea
  const toggleTarea = async (id: number | string) => {
    try {
      // Realiza una solicitud POST a la API para alternar el estado de la tarea
      const res = await fetch(`${API_URL}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido como JSON
        body: JSON.stringify({ action: "toggle" }), // Envía la acción 'toggle' para cambiar el estado
      });

      if (!res.ok) throw new Error("Error al actualizar tarea"); // Lanza un error si la respuesta no es exitosa

      const data = await res.json(); // Convierte la respuesta a JSON
      const tareaActualizadaBackend = data.tarea; // Extrae la tarea actualizada del backend

      // Crea un nuevo objeto Tarea adaptando las propiedades del backend
      const tareaActualizada = {
        id: tareaActualizadaBackend.id,
        title: tareaActualizadaBackend.content || tareaActualizadaBackend.title, // Usa 'content' o 'title' según esté disponible
        completed: tareaActualizadaBackend.completed,
      };

      // Actualiza el estado de tareas reemplazando la tarea actualizada
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? tareaActualizada : t))
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error); // Muestra un error si la solicitud falla
    }
  };

  // Función para eliminar una tarea
  const eliminarTarea = async (id: number | string) => {
    try {
      // Realiza una solicitud POST a la API para eliminar la tarea
      const res = await fetch(`${API_URL}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Especifica el tipo de contenido como JSON
        body: JSON.stringify({ action: "delete" }), // Envía la acción 'delete' para eliminar la tarea
      });

      if (!res.ok) throw new Error("Error al eliminar tarea"); // Lanza un error si la respuesta no es exitosa

      // Actualiza el estado de tareas eliminando la tarea con el ID especificado
      setTareas((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error); // Muestra un error si la solicitud falla
    }
  };

  // Función para eliminar todas las tareas completadas
  const eliminarCompletadas = async () => {
    try {
      // Realiza una solicitud DELETE a la API para eliminar todas las tareas completadas
      await fetch(`${API_URL}/completadas`, { method: "DELETE" });

      // Actualiza el estado de tareas eliminando las tareas que están completadas
      setTareas((prev) => prev.filter((t) => !t.completed));
    } catch (error) {
      console.error("Error al eliminar tareas completadas:", error); // Muestra un error si la solicitud falla
    }
  };

  // Filtra las tareas según el estado del filtro seleccionado
  const tareasFiltradas = tareas.filter((t) =>
    filtro === "all" ? true : filtro === "completed" ? t.completed : !t.completed
  );

  // Renderiza el componente principal de la aplicación
  return (
    <div className="app-container">
      <h1>Gestor de Tareas</h1>
      {/* Componente para agregar una nueva tarea */}
      <NuevaTareaInput onAgregar={agregarTarea} />
      {/* Componente para seleccionar el filtro de tareas */}
      <Filtros filtro={filtro} setFiltro={setFiltro} />
      {/* Componente que muestra la lista de tareas filtradas */}
      <TareaList
        tareas={tareasFiltradas}
        toggleTarea={toggleTarea}
        eliminarTarea={eliminarTarea}
      />
      {/* Botón para eliminar todas las tareas completadas */}
      <button onClick={eliminarCompletadas}>Clear Completed</button>
    </div>
  );
};

// Exporta el componente App como exportación por defecto
export default App;
