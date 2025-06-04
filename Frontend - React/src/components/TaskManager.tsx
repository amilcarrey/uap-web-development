import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Tipos
import { type Tablero } from "../types";

// Hooks personalizados
import { useAddTask } from "../hooks/hooks_task/useAddTask";
import { useTasks } from "../hooks/hooks_task/useTasks";
import { useToggleTask } from "../hooks/hooks_task/useToggleTask";
import { useDeleteTask } from "../hooks/hooks_task/useDeleteTask";
import { useClearCompleted } from "../hooks/hooks_task/useClearCompleted";
import { useEditarTarea } from "../hooks/hooks_task/useEditTask";
import { useTableros } from "../hooks/hooks_tablero/useTableros";

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

  // Params, navegación y location
  const { slug } = useParams();
  const id = slug?.split('-')[0];
  const navigate = useNavigate();
  const location = useLocation();

  // Tableros
  const { data: tableros = [] } = useTableros();
  const [selectedTableroId, setSelectedTableroId] = useState<number | null>(id ? parseInt(id, 10) : null);

  // Verifica que el tablero seleccionado exista, si no existe resetea a null
  useEffect(() => {
    const tableroExiste = tableros.some((t: Tablero) => t.id === selectedTableroId);
    if (!tableroExiste) setSelectedTableroId(null);
  }, [tableros, selectedTableroId]);

  // Tareas
  const { data: tasksData, isLoading, isError, error } = useTasks(
    backendFilter,
    currentPage,
    tasksPerPage,
    selectedTableroId,
    refetchInterval
  );

  // Edición de tarea
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // Tema oscuro
  const [, setIsDark] = useState(() =>
    window.document.documentElement.classList.contains("dark")
  );

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

  // Carga tema guardado en localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      window.document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      window.document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Guarda intervalo de refetch cuando cambia
  useEffect(() => {
    localStorage.setItem("refetchInterval", refetchInterval.toString());
  }, [refetchInterval]);

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
          onError: () => {
            addToast("Error al actualizar tarea.", "error");
          },
        }
      );
    } else {
      addTaskMutation.mutate(
        { descripcion: trimmedText, tableroId: selectedTableroId },
        {
          onSuccess: () => {
            setInputText("");
            addToast("¡Nueva tarea cargada! ⚽", "success");
          },
          onError: () => {
            addToast("Error al cargar tarea.", "error");
          },
        }
      );
    }
  };

  // Función para crear slugs de URLs
  function slugify(nombre: string) {
    return nombre
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  if (isLoading) return <div>Cargando tareas...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const { data: currentTasks = [], totalPages = 1 } = tasksData ?? {};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-white text-black dark:text-white min-h-screen transition-colors relative">

      {/* HEADER */}
      <header className="bg-orange-100 p-6 text-center dark:bg-gray-800 dark:text-white rounded-lg shadow-md transition">
        <h1 className="text-4xl font-bold mb-2">Buscador de Messis G-Tareas</h1>
      </header>

      {/* Imagen-Messi */}
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
          const nombreTablero = tableroSeleccionado ? tableroSeleccionado.nombre : '';
          navigate(`/tablero/${id}-${slugify(nombreTablero)}`);
        }}
        addToast={addToast}
      />

      {/* Formulario */}
      <TaskForm
        inputText={inputText}
        setInputText={setInputText}
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
      <section className="bg-orange-100 dark:bg-gray-800 dark:text-white dark:border-gray-800 p-6 rounded-lg mx-6 mb-6 transition shadow-md">
        <TaskList
          currentTasks={currentTasks}
          editingTaskId={editingTaskId}
          setEditingTaskId={setEditingTaskId}
          setInputText={setInputText}
          descripcionMayusculas={descripcionMayusculas}
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
        onTasksPerPageChange={(num) => {
          setTasksPerPage(num);
          setCurrentPage(1);
        }}
      />

      {/* Botones de acciones */}
      <section className="text-center mb-2 flex flex-col items-center gap-4">
        <button
          onClick={() =>
            clearCompletedMutation.mutate(undefined, {
              onError: () => addToast("Error al limpiar tareas completadas", "error"),
            })
          }
          className="bg-red-400 text-white px-6 py-3 rounded hover:bg-red-600 transition"
        >
          Limpiar tareas completadas
        </button>

        <button
          onClick={() => navigate('/configuracion')}
          className="text-black bg-gray-100 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-800 dark:text-white px-4 py-2 rounded shadow"
        >
          Configuración 🔩
        </button>
      </section>

    </div>
  );
};

export default TaskManager;
