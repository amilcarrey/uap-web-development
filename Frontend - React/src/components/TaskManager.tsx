import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from "@tanstack/react-query";
// Tipos
import { type Tablero } from "../types";
// Hooks personalizados
import { useAddTask } from "../hooks/hooks_task/useAddTask";
import { useToggleTask } from "../hooks/hooks_task/useToggleTask";
import { useDeleteTask } from "../hooks/hooks_task/useDeleteTask";
import { useClearCompleted } from "../hooks/hooks_task/useClearCompleted";
import { useEditarTarea } from "../hooks/hooks_task/useEditTask";
import { useTableros } from "../hooks/hooks_tablero/useTableros";
import { useSettings } from "../context/SettingsContext";
import { useSearchTasks } from "../hooks/hooks_task/useSearchTask";
// Autenti para logout.
import { useAuth } from "../context/AuthContext";
// Componentes
import Paginacion from "./Pagination";
import { FilterButtons } from "./filterbuttons";
import { useToasts } from './Toast';
import TaskForm from "./TaskForm";
import { TaskList } from "./TaskList";
import { Tableros } from "./Tableros";
// Store
import { type FilterOption, useTaskStore } from "../store";

// URL del backend
export const API_URL = "http://localhost:4321";
// Mapeo filtro frontend a backend
export const mapFilterToBackend = (
  filter: FilterOption
): "all" | "complete" | "incomplete" => {
  switch (filter) {
    case "done":
      return "complete";
    case "undone":
      return "incomplete";
    default:
      return "all";
  }
};

const TaskManager: React.FC = () => {
  // Estados
  const [inputText, setInputText] = useState("");
  const { addToast } = useToasts();

  //configss
  const { settings } = useSettings();
  const theme = settings?.theme || "light";

  // estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("");  
  const queryClient = useQueryClient();

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);

  // Configuraciones leídas desde localStorage (con valor por defecto)
  const [refetchInterval] = useState(() => {
    const saved = localStorage.getItem("refetchInterval");
    return saved ? Number(saved) : 10000;
  });
  const [descripcionMayusculas, setDescripcionMayusculas] = useState(() => {
    const saved = localStorage.getItem("descripcionMayusculas");
    return saved ? JSON.parse(saved) : false;
  });

  // Filtros y store
  const currentFilter = useTaskStore((state) => state.currentFilter);
  const setCurrentFilter = useTaskStore((state) => state.setCurrentFilter);
  const backendFilter = mapFilterToBackend(currentFilter);

  // Mutations y queries
  const addTaskMutation = useAddTask();
  const toggleCompleteMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();
  const clearCompletedMutation = useClearCompleted();
  const editTaskMutation = useEditarTarea();

  //logout
  const { logout } = useAuth(); 

  // Params, navegación y location
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const location = useLocation();

  // Tableros
  const { data: tableros = [] } = useTableros();
  
  const selectedTableroId = useTaskStore((state) => state.selectedTableroId);
  const setSelectedTableroId = useTaskStore((state) => state.setSelectedTableroId);

  // Verifica que el tablero seleccionado exista, si no existe resetea a null
  useEffect(() => {
    const tableroExiste = tableros.some((t: Tablero) => t.id === selectedTableroId);
    if (!tableroExiste) setSelectedTableroId(null);
  }, [tableros, selectedTableroId]);

  // Tarea
const { data: tasksData, isLoading, isError, error } = useSearchTasks(
  searchQuery,       
  backendFilter,
  currentPage,
  tasksPerPage,
  selectedTableroId,
  refetchInterval
);

  // Edición de tarea
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  useEffect(() => {
  setCurrentPage(1);
}, [selectedTableroId, backendFilter, tasksPerPage]);


    // Para inicializar el estado con el id de la url al montar el componente:
    useEffect(() => {
    if (id) {
      setSelectedTableroId(parseInt(id, 10));
    }
  }, [id, setSelectedTableroId]);

  // Actualiza descripcionMayusculas si cambia la ruta (por si se modificó en otro lado)
  useEffect(() => {
    const saved = localStorage.getItem("descripcionMayusculas");
    if (saved !== null) {
      setDescripcionMayusculas(JSON.parse(saved));
    }
  }, [location]);

  // Guarda descripcionMayusculas en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("descripcionMayusculas", JSON.stringify(descripcionMayusculas));
  }, [descripcionMayusculas]);

  // Guarda intervalo de refetch cuando cambia
  useEffect(() => {
    localStorage.setItem("refetchInterval", refetchInterval.toString());
  }, [refetchInterval]);

  // Función para activar la búsqueda real solo cuando el usuario confirma
const handleSearch = () => {
  setSearchQuery(inputText.trim());
  setCurrentPage(1);
};

const handleTasksPerPageChange = (num: number) => {
  setCurrentPage(1);
  setTasksPerPage(num);
};

  // Añadir o editar tarea
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTableroId === null) {
      addToast("Selecciona un tablero antes de añadir una tarea", "error");
      return;
    }

    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    if (editingTaskId !== null) {
      editTaskMutation.mutate(
        { id: editingTaskId, descripcion: trimmedText },
        {
          onSuccess: () => {
            setEditingTaskId(null);
            setInputText("");
            addToast("¡La tarea ha sido actualizada! ✏️", "success");
          },
          onError: (error: Error) => {
            addToast(" Error al actualizar tarea. " + error.message );
          },
        }
      );
    } else {
      addTaskMutation.mutate(
        { descripcion: trimmedText, tableroId: selectedTableroId },
        {
          onSuccess: () => {
            setInputText("");
            queryClient.invalidateQueries({
            queryKey: ['tasks', searchQuery, backendFilter, currentPage, tasksPerPage, selectedTableroId]
          });
            addToast("¡Nueva tarea cargada! ⚽", "success");
          },
          onError: (error: Error) => {
            addToast("Error al cargar tarea. " + error.message);
          },
        }
      );
    }
  };

  // Función para crear slugs de URLs
  function slugify(nombre: string) {
    if (!nombre) return '';
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  const currentTasks = useTaskStore((state) => state.tasks);
  const totalPages = tasksData?.totalPages ?? 1;

  if (isLoading) return <div>Cargando tareas...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;




  return (
  <div
    className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors relative ${
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
    }`}
  >
    {/* HEADER */}
    <header
      className={`p-6 text-center rounded-lg shadow-md transition ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-orange-100 text-black"
      }`}
    >
      <h1 className="text-4xl font-bold mb-2">Buscador de Messis G-Tareas</h1>
    </header>

    {/* Imagen Messi */}
    <div className="flex justify-center my-6 rounded-lg">
      <img
        src="https://www.fifpro.org/media/ovzgbezo/messi_w11_2024.jpg"
        alt="Lionel Messi"
        className="h-40 rounded-lg transition-transform duration-300 ease-in-out hover:scale-110"
      />
    </div>

    {/* Tableros */}
    <Tableros
      selectedTableroId={selectedTableroId}
      setSelectedTableroId={(id) => {
        setSelectedTableroId(id);
        const tableroSeleccionado = tableros.find((t: Tablero) => t.id === id);
        const nombreTablero = tableroSeleccionado ? tableroSeleccionado.name : "";
        const slug = slugify(nombreTablero);
        navigate(`/tablero/${id}${slug ? `/${slug}` : ""}`);
      }}
      addToast={addToast}
    />

    {/* Formulario */}
    <TaskForm
        inputText={inputText}
        setInputText={setInputText}
        handleSearch={handleSearch}    
        editingTaskId={editingTaskId}
        setEditingTaskId={setEditingTaskId}
        handleAddTask={handleAddTask}
        selectedTableroId={selectedTableroId}
      />

    {/* Botones de filtro */}
    <div className="flex justify-center gap-4 mb-6">
      <FilterButtons
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        setCurrentPage={setCurrentPage}
      />
    </div>

    {/* Lista de tareas */}
    <section
      className={`p-6 rounded-lg mx-6 mb-6 transition shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-orange-100 text-black"
      }`}
    >
      <TaskList
        currentTasks={currentTasks}
        editingTaskId={editingTaskId}
        setEditingTaskId={setEditingTaskId}
        setInputText={setInputText}
        deleteTaskMutation={deleteTaskMutation}
        toggleCompleteMutation={toggleCompleteMutation}
        addToast={addToast}
      />
    </section>

    {/* Paginación */}
    <Paginacion
      currentPage={currentPage}
    totalPages={totalPages}
    tasksPerPage={tasksPerPage}
    onPageChange={setCurrentPage}
    onTasksPerPageChange={handleTasksPerPageChange}
    />

    {/* Botones de acciones */}
    <section className="text-center mb-2 flex flex-col items-center gap-4">
      <button
        onClick={() => {
          if (!selectedTableroId) {
            addToast("No hay un tablero seleccionado", "error");
            return;
          }
          clearCompletedMutation.mutate(String(selectedTableroId), {
            onError: (error: Error) =>
              addToast("Error al limpiar tareas completadas: " + error.message),
          });
        }}
        className="bg-red-400 text-white px-6 py-3 rounded hover:bg-red-600 transition"
      >
        Limpiar tareas completadas
      </button>

      <button
        onClick={() => navigate("/configuracion")}
        className={`px-4 py-2 rounded shadow ${
          theme === "dark"
            ? "bg-gray-600 hover:bg-gray-800 text-white"
            : "bg-gray-100 hover:bg-gray-300 text-black"
        }`}
      >
        Configuración 🔩
      </button>

      <button onClick={logout} className="text-red-500">
        Cerrar sesión
      </button>
    </section>
  </div>
);
};

export default TaskManager;
