import React from "react";

interface Tarea {
  id: number | string;
  title: string;
  completed: boolean;
}

// Componente que renderiza la lista de tareas
const TareaList: React.FC<{
  tareas: Tarea[];
  toggleTarea: (id: number | string) => void;
  eliminarTarea: (id: number | string) => void;
}> = ({ tareas, toggleTarea, eliminarTarea }) => (
  <ul className="task-list">
    {tareas.map((t) => (
      <li key={t.id} className="task-item">
        <div>
          {/* Casilla de verificación para marcar completada */}
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => toggleTarea(t.id)}
          />
          {/* Texto de la tarea, con clase condicional si está completada */}
          <span className={`task-text ${t.completed ? "completed" : ""}`}>
            {t.title}
          </span>
        </div>
        {/* Botón para eliminar la tarea */}
        <button onClick={() => eliminarTarea(t.id)}>Eliminar</button>
      </li>
    ))}
  </ul>
);

export default TareaList;
