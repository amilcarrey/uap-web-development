import React from "react";

// Componente funcional TareaItem, que recibe como props una tarea y dos funciones: toggleTarea y eliminarTarea
const TareaItem: React.FC<{
  tarea: { id: number; title: string; completed: boolean }; // Prop "tarea" con id, título y estado de completado
  toggleTarea: (id: number) => void; // Función para alternar estado de la tarea
  eliminarTarea: (id: number) => void; // Función para eliminar la tarea
}> = ({ tarea, toggleTarea, eliminarTarea }) => (
  <li className="task-item">
    <div>
      {/* Checkbox para marcar como completada o no */}
      <input
        type="checkbox"
        checked={tarea.completed} // Muestra el estado de completado de la tarea
        onChange={() => toggleTarea(tarea.id)} // Al cambiar, llama a toggleTarea con el id
      />
      {/* Texto de la tarea, con estilo si está completada */}
      <span className={`task-text ${tarea.completed ? "completed" : ""}`}>
        {tarea.title} // Muestra el título de la tarea
      </span>
    </div>
    {/* Botón para eliminar la tarea */}
    <button onClick={() => eliminarTarea(tarea.id)}>Eliminar</button>
  </li>
);

export default TareaItem; // Exporta el componente para usarlo en otros archivos
