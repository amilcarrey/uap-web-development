import { useState } from "react";
import { useCompleteTask } from "../hooks/useCompleteTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import TaskForm from "./TaskForm";
import type { Task as TaskType } from "../types";
import { useToastStore } from "../stores/useToastStore";

type TaskProps = {
  task: TaskType;
  uppercase?: boolean;
};

function Task({ task, uppercase = false }: TaskProps) {
  const { mutate: completeTask } = useCompleteTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToastStore();
   const description = uppercase ? task.name.toUpperCase() : task.name;

  return (
    <li className="flex justify-between w-full p-7 border-b border-gray-700">
      <button
        onClick={() => completeTask(task.id, 
          {
        
            onSuccess: () => {
              if(!task.completed) {
              showToast("Tarea completada correctamente", "success");
              }
            },
            onError: (err) => {
              showToast((err as Error).message || "Error al completar tarea", "error");
            }
          }
        )}
        className="w-6 h-6 border-2 border-blue-600 rounded-full text-sm text-blue-600 hover:bg-blue-100 cursor-pointer"
      >
        {task.completed ? "✔" : ""}
      </button>

      <div className="flex-grow text-center p-3.5">
        {isEditing ? (
          <TaskForm
            taskToEdit={{ id: task.id, name: task.name }}
            clearEdit={() => setIsEditing(false)}
            inline
          />
        ) : (
          <label className={task.completed ? "line-through text-gray-500" : ""}>
            {description}
          </label>
        )}
      </div>

      {isEditing ? (
        <button onClick={() => setIsEditing(false)}>
          <i className="fa-solid fa-xmark cursor-pointer text-red-500 hover:text-red-700"></i>
        </button>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)}>
            <i className="fa-solid fa-pen-to-square cursor-pointer mr-5 hover:text-green-500"></i>
          </button>
          <button onClick={() => deleteTask(task.id, 
            {
              onSuccess: () => {
                showToast("Tarea eliminada correctamente", "success");

              },
              onError: (err) => {
                showToast((err as Error).message || "Error al eliminar tarea", "error");
                
              }
            }
          )}>
            <i className="fa-solid fa-trash cursor-pointer text-red-500 hover:text-red-700"></i>
          </button>
        </>
      )}
    </li>
  );
}

export default Task;
