// src/components/TaskItem.jsx
import React from 'react';
import deleteIcon from '../assets/tacho de basura.png';
// Asumiendo que tienes un icono de edición, si no, puedes usar un texto o un SVG simple
import editIcon from '../assets/edit_icon.png'; // Asegúrate de tener este icono o crea uno

// Recibe onEditTask y isEditing
const TaskItem = ({ task, onToggleCompleted, onDeleteTask, onEditTask, isEditing }) => {
  return (
    <li className="flex items-center justify-between p-2 border-b last:border-b-0">
      <div className="flex items-center">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompleted(task.id)}
            className="sr-only peer"
          />
          <div className="
            w-6 h-6 rounded-full border-2 border-gray-400
            peer-checked:bg-indigo-600 peer-checked:border-indigo-600
            flex items-center justify-center
            transition-all duration-200 ease-in-out
          ">
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </label>
        <span className={`ml-3 text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.text}
        </span>
      </div>
      <div className="flex items-center gap-2"> {/* Contenedor para los botones */}
        {/* Botón de editar */}
        {!isEditing && ( // Solo muestra el botón si no está en modo edición
          <button
            onClick={() => onEditTask(task)} // Pasa la tarea completa para editar
            className="bg-transparent border-none cursor-pointer p-1"
            title="Edit task"
          >
            {/* Si no tienes un icono, usa un SVG o texto simple */}
            <img src={editIcon} alt="Edit" className="w-8 h-8" />
            {/* O simplemente: <span className="text-blue-500">Edit</span> */}
          </button>
        )}

        {/* Botón de eliminar */}
        <button
          onClick={() => onDeleteTask(task.id)}
          className="bg-transparent border-none cursor-pointer p-1"
          title="Delete task"
        >
          <img src={deleteIcon} alt="Delete" className="w-8 h-8" />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;