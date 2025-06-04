import { useToggleTask, useDeleteTask, useEditTask } from "../api/useTasks";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useConfigStore } from "../state/configStore";
import type { Task } from "../state/taskStore";

export default function TaskItem({ task }: { task: Task }) {
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const editTask = useEditTask();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(task.name);
  const mayusculas = useConfigStore((s) => s.mayusculas);

  const handleEdit = () => {
    editTask.mutate(
      { id: task.id, name: newName },
      {
        onSuccess: () => {
          toast.success("Tarea actualizada");
          setIsEditing(false);
        },
        onError: () => toast.error("Error al editar tarea"),
      }
    );
  };

  return (
    <li className="flex justify-between items-center bg-orange-100 p-2 rounded w-full">
      <div className="flex items-center gap-2 w-full">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() =>
            toggleTask.mutate(task, {
              onError: () => toast.error("Error al cambiar estado"),
            })
          }
        />
        {isEditing ? (
          <input
            className="border rounded p-1 w-full"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        ) : (
          <span
            className={`flex-1 ${task.completed ? "line-through text-gray-500" : ""}`}
          >
            {mayusculas ? task.name.toUpperCase() : task.name}
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-1 ml-2">
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            Guardar
          </button>
          <button
            onClick={() => {
              setNewName(task.name);
              setIsEditing(false);
            }}
            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-400 text-black px-2 py-1 rounded hover:bg-yellow-500"
          >
            Editar
          </button>
          <button
            onClick={() =>
              deleteTask.mutate(task.id, {
                onError: () => toast.error("Error al eliminar tarea"),
              })
            }
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      )}
    </li>
  );
}
