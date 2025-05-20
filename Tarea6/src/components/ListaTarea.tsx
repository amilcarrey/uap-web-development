import type { Tarea } from "../types/tarea";

interface Props {
  tareas: Tarea[];
  toggleCompletar: (id: string) => void;
  removeTarea: (id: string) => void;
}

export function ListaTareas({ tareas, toggleCompletar, removeTarea }: Props) {
  return (
    <ul>
      {tareas.map((tarea) => (
        <li key={tarea.id} className="tarea">
          <input
            type="checkbox"
            checked={tarea.completed}
            onChange={() => toggleCompletar(tarea.id)}
          />
          <span style={{ textDecoration: tarea.completed ? "line-through" : "none" }}>
            {tarea.content}
          </span>
          <button className="basura" onClick={() => removeTarea(tarea.id)}>
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
}
