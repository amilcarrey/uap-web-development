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
  import type { Task } from "../lib/tasks";
  import { useModalStore } from "../store/modalStore";

 
  type TaskManagerProps = {
    filtro?: "completadas" | "pendientes";
  };

  
  function TaskManager({ filtro }: TaskManagerProps) {
   const [page, setPage] = useState(1);
   const [pageSize] = useState(7); // Puedes cambiar el valor por defecto
   const { data = { tasks: [], totalPages: 1 }, isLoading, error } = useTasks(filtro, page, pageSize);
   const tasks = data.tasks as Task[];

    const addTaskMutation = useAddTask();
    const deleteTaskMutation = useDeleteTask();
    const toggleTaskMutation = useToggleTask();
    const deleteCompletedMutation = useDeleteCompletedTasks();
    const editTaskMutation = useEditTask();



const handleAddTask = (text: string) => {
  addTaskMutation.mutate(
    { text },
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea agregada", "success"),
      onError: () => useModalStore.getState().openModal("Error al agregar tarea", "error"),
    }
  );
};

const handleDeleteTask = (id: number) => {
  deleteTaskMutation.mutate(
    { id },
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
    { id },
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
  // Filtra las tareas completadas
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length === 0) {
    useModalStore.getState().openModal("No hay tareas completadas para eliminar", "success");
    return;
  }
  deleteCompletedMutation.mutate(undefined, {
    onSuccess: () => useModalStore.getState().openModal("Tareas completadas eliminadas", "success"),
    onError: () => useModalStore.getState().openModal("Error al eliminar tareas completadas", "error"),
  });
};
const handleEditTask = (id: number, text: string) => {
  editTaskMutation.mutate(
    { id, text },
    {
      onSuccess: () => useModalStore.getState().openModal("Tarea editada", "success"),
      onError: () => useModalStore.getState().openModal("Error al editar tarea", "error"),
    }
  );
};

    return (
      <div className="TaskManager flex flex-col items-center justify-center w-full h-full">
        <Title />
        <CategoryButtons />
        <TaskInput onAddTask={handleAddTask} />
        <Filters />

        {isLoading ? (
          <p className="text-gray-500">Cargando tareas...</p>
        ) : error ? (
          <p className="text-red-500">Error al cargar tareas</p>
        ) : (
          <TaskList
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onToggleCompletion={handleToggleCompletion}
            onEditTasks={handleEditTask} //funcion flecha que se pasa como prop a TaskList
          />
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
          className="clearCompletedButton bg-orange-400 text-white font-bold cursor-pointer hover:bg-[rgb(139,90,0)] w-[80%] h-[40px] rounded-[5px] border-none flex items-center justify-center mb-[20px]">
          <i className="fas fa-trash"></i> Eliminar Completas
        </button>
      </div>
    );
  }

  export default TaskManager;
