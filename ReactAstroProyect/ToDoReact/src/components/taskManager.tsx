import Title from "./title";
  import CategoryButtons from "./categoryButtons";
  import TaskInput from "./taskInput";
  import Filters from "./filters";
  import TaskList from "./taskList";
  import {useState} from "react";
  import { useTasks } from "../hooks/useTasks";
  import { useAddTask } from "../hooks/useAddTask";
  import { useDeleteTask } from "../hooks/useDeleteTask";
  import { useToggleTask } from "../hooks/useToggleTask";
  import { useDeleteCompletedTasks } from "../hooks/useDeleteCompleted";
  import { useEditTask } from "../hooks/useEditTasks";
  import { useModalStore } from "../store/modalStore";
  import { useParams } from "@tanstack/react-router";
  import { useSearch } from "@tanstack/react-router";
  import { useCategorias } from "../hooks/useCategorias";
  import type { Categoria } from "../types";


function TaskManager() {
  const search = useSearch({ from: "/categorias/$categoriaId" });
  const filtro = search.filtro === "completadas" || search.filtro === "pendientes" ? search.filtro : undefined;
  const [page, setPage] = useState(1);
  const [pageSize] = useState(7);
  const { categoriaId } = useParams({ from: "/categorias/$categoriaId" });
  const searchTerm = search.search || undefined;

  // Tareas
  const { data = { tasks: [], totalPages: 1 }, isLoading, error } = useTasks(filtro, page, pageSize, categoriaId, searchTerm);
  const tasks = data.tasks;
  const addTaskMutation = useAddTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTask();
  const deleteCompletedMutation = useDeleteCompletedTasks();
  const editTaskMutation = useEditTask();
    // Estado para el modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false); // Controla el modal de confirmación
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null); // Almacena la categoría a eliminar

  // Categorias
  const { categoriasQuery, addCategoriaMutation, deleteCategoriaMutation } = useCategorias();
  const currentCategory = categoriasQuery.data?.find((cat: Categoria) => cat.id === categoriaId);


// Funciones para tareas
const handleAddTask = (text: string) => {
  addTaskMutation.mutate(
    { text, categoriaId},
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea agregada", "success"),
      onError: (error: any) => {
        // MOSTRAR mensaje específico del backend
        const errorMessage = error?.response?.data?.error || error?.message || "Error al agregar tarea";
        useModalStore.getState().openModal(errorMessage, "error");
      },
    }
  );
};

const handleDeleteTask = (id: number) => {
  deleteTaskMutation.mutate(
    { id, categoriaId, page}, 
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea eliminada", "success"),
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Error al eliminar tarea";
        useModalStore.getState().openModal(errorMessage, "error");
      },
    }
  );
};

const handleToggleCompletion = (id: number) => {
  // Busca la tarea antes de mutar
  const task = tasks.find((t) => t.id === id);
  const estabaCompleta = task?.completed;

  toggleTaskMutation.mutate(
    { id, categoriaId, page}, 
    {
      onSuccess: () => {
        if (estabaCompleta) {
          useModalStore.getState().openModal("Tarea marcada como pendiente", "success");
        } else {
          useModalStore.getState().openModal("Tarea marcada como completa", "success");
        }
      },
        onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Error al cambiar estado de una tarea";
        useModalStore.getState().openModal(errorMessage, "error");
      },
    }
  );
};

const handleDeleteCompleted = () => {
  // Filtra las tareas completadas
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length === 0) {
    useModalStore.getState().openModal("No hay tareas completadas para eliminar", "success");
    return;
  }
  deleteCompletedMutation.mutate(
    { categoriaId}, 
    {
    // No necesitamos pasar un id porque estamos eliminando todas las completadas
    onSuccess: () => useModalStore.getState().openModal("Tareas completadas eliminadas", "success"),
    onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Error al eliminar las tareas completas";
        useModalStore.getState().openModal(errorMessage, "error");
      },
  });
};
const handleEditTask = (id: number, text: string) => {
  editTaskMutation.mutate(
    { id, text, categoriaId, page}, 
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea editada", "success"),
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Error al editar una tarea";
        useModalStore.getState().openModal(errorMessage, "error");
      },
    }
  );
};

// Funciones para categorias
const handleAddCategoria = (name: string) => {
  if (categoriasQuery.data?.some((categoria: Categoria) => categoria.name.toLowerCase() === name.toLowerCase())) {
    useModalStore.getState().openModal("El nombre de la categoría ya está en uso", "error");
    return;
  }

  const id = name.toLowerCase().replace(/\s+/g, "-"); // Generar un ID único basado en el nombre

  addCategoriaMutation.mutate(
    { id, name }, // Pasa un objeto con `id` y `name`
    {
      onSuccess: () => useModalStore.getState().openModal("Categoría creada", "success"),
      onError: (error: any) => {
        // MOSTRAR mensaje específico del backend
        const errorMessage = error?.response?.data?.error || error?.message || "Error al agregar categoria";
        useModalStore.getState().openModal(errorMessage, "error");
      },
    }
  );
};

 const confirmDeleteCategoria = (id: string) => {
  setCategoryToDelete(id); 
  setIsDeleteCategoryModalOpen(true); 
};

const handleDeleteCategoria = () => {
  if (!categoryToDelete || categoryToDelete.trim() === "") {
    useModalStore.getState().openModal("Por favor, ingresa un nombre o ID válido", "error");
    return;
  }

  deleteCategoriaMutation.mutate(categoryToDelete, {
    onSuccess: () => {
      useModalStore.getState().openModal("Categoría eliminada", "success");
      setCategoryToDelete(null); // Limpia la categoría seleccionada
    },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.error || error?.message || "Error al eliminar categoria";
        useModalStore.getState().openModal(errorMessage, "error");
      },
  });
  setIsDeleteCategoryModalOpen(false); 
};

// Verificar si hay un error 404 cuando la url es inválida
if (error?.message === "URL inválida: El tablero no existe") {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-2xl font-bold text-red-500">URL inválida: El tablero no existe</h1>
      <button
        onClick={() => (window.location.href = "/settings")}
        className="bg-orange-400 text-white px-4 py-2 rounded mt-4"
      >
        Ir a Configuraciones
      </button>
    </div>
  );
}
  
return (
  <div className="TaskManager flex flex-col items-center justify-center w-full h-full">
    <Title />
    <CategoryButtons
      categorias={categoriasQuery.data || []}
      onAddCategoria={() => setIsAddModalOpen(true)}
      onDeleteCategoria={confirmDeleteCategoria}
    />
    <TaskInput onAddTask={handleAddTask} /> 
    <Filters /> 

    {/* Manejo de estados de carga, error y tareas */}
    {isLoading ? (
      <p className="text-gray-500">Cargando tareas...</p> 
    ) : error ? (
      <p className="text-red-500">Error al cargar tareas</p> 
    ) : tasks && tasks.length > 0 ? ( // Verifica que tasks esté definido y tenga elementos
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask} 
        onToggleCompletion={handleToggleCompletion} 
        onEditTasks={handleEditTask} 
        currentCategory={currentCategory}
      />
    ) : (
        <p className="text-gray-500">
    {searchTerm 
      ? `No se encontraron tareas que coincidan con "${searchTerm}"` // Muestra un mensaje si hay un término de búsqueda
      : "No hay tareas disponibles." // Muestra un mensaje si no hay tareas y no hay búsqueda
    }
  </p>
    )}

    {/* Paginación */}
    <div className="flex gap-4 my-4">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))} // Asegura que no vaya a menos de 1
        disabled={page === 1} 
        className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50"
      >
        <i className="fas fa-arrow-left"></i> Anterior
      </button>
      <span>
        Página {page} de {data.totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} // Asegura que no sea mas que totalPages
        disabled={page === data.totalPages} 
        className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50"
      >
        <i className="fas fa-arrow-right"></i> Siguiente
      </button>
    </div>

    {/* Botón para eliminar tareas completadas */}
    <button
      onClick={handleDeleteCompleted} // Llama a la función para eliminar tareas completadas
      className="clearCompletedButton bg-orange-400 text-white font-bold cursor-pointer hover:bg-[rgb(139,90,0)] w-[80%] h-[40px] rounded-[5px] border-none flex items-center justify-center mb-[20px] space-x-2"
    >
      <i className="fas fa-trash"></i> Eliminar Completas
    </button>

    {/* Modal para agregar categoría */}
    {isAddModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
          <h2 className="text-xl font-bold text-gray-800">Agregar Categoría</h2>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)} // Actualiza el estado con el nombre de la categoría
            placeholder="Nombre de la categoría"
            className="mt-4 w-full p-2 border rounded"
          />
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => {
                setIsAddModalOpen(false); 
                setNewCategoryName(""); 
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (newCategoryName.trim()) {
                  handleAddCategoria(newCategoryName); 
                  setIsAddModalOpen(false); 
                  setNewCategoryName(""); 
                } else {
                  useModalStore
                    .getState()
                    .openModal(
                      "El nombre de la categoría no puede estar vacío",
                      "error"
                    ); // Muestra un mensaje de error si el campo está vacío
                }
              }}
              className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
      )}
        {isDeleteCategoryModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
              <h2 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
              <p className="mt-4">Por favor, ingresa el nombre de la categoría que deseas eliminar:</p>
              <input
                type="text"
                value={categoryToDelete || ""}
                onChange={(e) => setCategoryToDelete(e.target.value)} // Actualiza el estado con el valor ingresado
                placeholder="Nombre de la categoría"
                className="mt-4 w-full p-2 border rounded"
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setIsDeleteCategoryModalOpen(false)} // Cierra el modal sin eliminar
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteCategoria} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
  </div>
);
}
export default TaskManager;
