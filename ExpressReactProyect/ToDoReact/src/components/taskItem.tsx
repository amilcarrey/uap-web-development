import type { Task } from "../types";
import { useState } from "react";
import { useSettingsStore } from "../store/settingsStore";

interface TaskItemProps {
  task: Task;
  onDelete: () => void;
  onToggleCompletion: () => void;
  onEditTasks: (newText: string) => void; // Recibe id + texto
}



function TaskItem({ task, onDelete, onToggleCompletion, onEditTasks }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(task.text);
    const uppercaseDescriptions = useSettingsStore((state) => state.uppercaseDescriptions);

    const handleEditClick = () => {
      setIsEditing(true);
    };

    const handleSaveClick = () => {
      onEditTasks(editedText); // Llama a la función con el nuevo texto
      setIsEditing(false); // Sale del modo edición
    };
    console.log("uppercaseDescriptions en TaskItem:", uppercaseDescriptions);
console.log("Texto de la tarea:", task.text);
  return (
      <div className="Task flex justify-between items-center w-[83%] p-[10px] rounded-[5px] bg-[rgb(83,57,88)]">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggleCompletion}
            className={`checkTask appearance-none w-[47px] h-[40px] border-2 rounded-[8px] cursor-pointer relative transition-all duration-300
              text-white text-[14px]
              ${task.completed
                ? 'bg-green-600 border-green-600 after:content-["DONE"]'
                : 'border-gray-400 after:content-[""]'}
              after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none`}
            style={{ textAlign: "center" }}
        />
      {isEditing ? (
        <input
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="flex-1 text-center text-white bg-transparent border-b-2 border-white focus:outline-none mr-4"
        />
      ) : (
        <span
          className={`flex-1 text-center transition-all duration-300 
            ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}
        >
          {uppercaseDescriptions ? task.text.toUpperCase() : task.text}
        </span>
      )}

{isEditing ? (
  <>
    <button
      onClick={handleSaveClick}
      className="EditButton flex items-center gap-2 bg-green-500 text-white rounded-[5px] px-5 py-2 mr-[8px] cursor-pointer text-[16px] hover:bg-green-700 transition"
      type="button">
      <i className="fas fa-edit"></i> Guardar
    </button>
    <button
      onClick={() => {
        setIsEditing(false);
        setEditedText(task.text); // Revierte el texto editado
      }}
      className="flex items-center gap-2 bg-gray-500 text-white rounded-[5px] px-5 py-2 mr-[8px] cursor-pointer text-[16px] hover:bg-gray-700 transition"
      type="button">
      <i className="fas fa-times"></i> Cancelar
    </button>
  </>
) : (
  <button
    onClick={handleEditClick}
    className="EditButton flex items-center gap-2 bg-orange-400 text-white rounded-[5px] px-5 py-2 mr-[8px] cursor-pointer text-[16px] hover:bg-[rgb(139,90,0)] transition"
    type="button">
    <i className="fas fa-edit"></i> Editar
  </button>
)}


        <button
          onClick={onDelete}
          className="deleteTask flex items-center gap-2 bg-orange-400 text-white rounded-[5px] px-5 py-2 cursor-pointer text-[16px] hover:bg-[rgb(139,90,0)] transition"
          type="button">
          <i className="fas fa-trash"></i> Eliminar
        </button>
      </div>
  );
}

export default TaskItem;
