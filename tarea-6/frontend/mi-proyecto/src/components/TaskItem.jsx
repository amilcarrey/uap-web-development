import React from 'react';



import deleteIcon from '../assets/tacho de basura.png'; // Importa la imagen del icono de eliminar

const TaskItem = ({ task, index, onToggleCompleted, onDeleteTask }) => {
  return (
    <li className="flex items-center justify-between p-2 border-b last:border-b-0">
      <div className="flex items-center">
        {/* Aquí está el cambio para el checkbox */}
        <label className="relative flex items-center cursor-pointer">
          {/* El checkbox nativo, oculto pero funcional */}
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompleted(index)}
            className="sr-only peer" // sr-only oculta visualmente pero lo mantiene accesible para lectores de pantalla
          />
          {/* El div que será visualmente el checkbox redondo */}
          <div className="
            w-6 h-6 rounded-full border-2 border-gray-400
            peer-checked:bg-indigo-600 peer-checked:border-indigo-600
            flex items-center justify-center
            transition-all duration-200 ease-in-out
          ">
            {/* El ícono de checkmark que aparece cuando está marcado */}
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </label>
        {/* Texto de la tarea */}
        <span className={`ml-3 text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.text}
        </span>
      </div>
      {/* Botón de eliminar */}
      <button
        onClick={() => onDeleteTask(index)}
        className="bg-transparent border-none cursor-pointer p-1" // Añadí p-1 para un mejor área de clic
      >
        <img src={deleteIcon} alt="Delete" className="w-8 h-8" />
      </button>
    </li>
  );
};

export default TaskItem;