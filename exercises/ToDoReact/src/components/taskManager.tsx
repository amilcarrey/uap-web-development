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

  // Tareas
  const { data = { tasks: [], totalPages: 1 }, isLoading, error } = useTasks(filtro, page, pageSize, categoriaId);
  const tasks = data.tasks;
  const addTaskMutation = useAddTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleTaskMutation = useToggleTask();
  const deleteCompletedMutation = useDeleteCompletedTasks();
  const editTaskMutation = useEditTask();

  // Categorias
  const { categoriasQuery, addCategoriaMutation, deleteCategoriaMutation } = useCategorias();


// Funciones para tareas
const handleAddTask = (text: string) => {
  addTaskMutation.mutate(
    { text, categoriaId, page },
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea agregada", "success"),
      onError: () => useModalStore.getState().openModal("Error al agregar tarea", "error"),
    }
  );
};

const handleDeleteTask = (id: number) => {
  deleteTaskMutation.mutate(
    { id, categoriaId, page}, 
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea eliminada", "success"),
      onError: () => useModalStore.getState().openModal("Error al eliminar tarea", "error"),
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
      onError: () => useModalStore.getState().openModal("Error al cambiar estado de tarea", "error"),
    }
  );
};

const handleDeleteCompleted = () => {
  console.log("Datos enviados desde TaskManager:", { categoriaId });
  // Filtra las tareas completadas
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length === 0) {
    useModalStore.getState().openModal("No hay tareas completadas para eliminar", "success");
    return;
  }
  deleteCompletedMutation.mutate(
    { categoriaId, page}, 
    {
    // No necesitamos pasar un id porque estamos eliminando todas las completadas
    onSuccess: () => useModalStore.getState().openModal("Tareas completadas eliminadas", "success"),
    onError: () => useModalStore.getState().openModal("Error al eliminar tareas completadas", "error"),
  });
};
const handleEditTask = (id: number, text: string) => {
   console.log("Llamando a mutate con:", { id, text, categoriaId, page});
  editTaskMutation.mutate(
    { id, text, categoriaId, page}, 
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea editada", "success"),
      onError: () => useModalStore.getState().openModal("Error al editar tarea", "error"),
    }
  );
};

// Funciones para categorias
  const handleAddCategoria = (name: string) => {
    // Verificar si el nombre ya está en uso
    if (categoriasQuery.data?.some((categoria:Categoria) => categoria.name.toLowerCase() === name.toLowerCase())) {
      useModalStore.getState().openModal("El nombre de la categoria ya está en uso", "error");
      return;
    }

    // Si no está en uso, proceder a agregar la categoria
    addCategoriaMutation.mutate(name, {
      onSuccess: () => useModalStore.getState().openModal("Categoria creada", "success"),
      onError: () => useModalStore.getState().openModal("Error al crear la categoria", "error"),
    });
  };

  const handleDeleteCategoria = (id: string) => {
    deleteCategoriaMutation.mutate(id, {
      onSuccess: () =>  useModalStore.getState().openModal("Categoria eliminada", "success"),
      onError: () =>  useModalStore.getState().openModal("Error al eleiminar la categoria", "error"),
    });
  };


console.log("Tareas pasadas a TaskList:", data?.tasks); // Agrega este log para verificar las tareas
console.log("categoriaId en TaskManager:", categoriaId);
console.log("filtro en TaskManager:", filtro);

    return (
      <div className="TaskManager flex flex-col items-center justify-center w-full h-full">
        <Title />
        <CategoryButtons
        categorias={categoriasQuery.data || []}
        onAddCategoria={handleAddCategoria}
        onDeleteCategoria={handleDeleteCategoria}
      />
        <TaskInput onAddTask={handleAddTask} />
        <Filters />

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
          />
        ) : (
          <p>No hay tareas disponibles.</p> // Maneja el caso donde tasks está vacío
        )}

      <div className="flex gap-4 my-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))} // Asegura que no vaya a menos de 1
          disabled={page === 1} // Deshabilita si es la primera página
          className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50">
          <i className="fas fa-arrow-left"></i> Anterior
        </button>
        <span>Página {page} de {data.totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          disabled={page === data.totalPages}
          className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50">
          <i className="fas fa-arrow-right"></i> Siguiente
        </button>
      </div>

        <button
          onClick={handleDeleteCompleted}
          className="clearCompletedButton bg-orange-400 text-white font-bold cursor-pointer hover:bg-[rgb(139,90,0)] w-[80%] h-[40px] rounded-[5px] border-none flex items-center justify-center mb-[20px] SPACE-x-2">
          <i className="fas fa-trash "></i> Eliminar Completas
        </button>
      </div>
    );
  }

  export default TaskManager;
