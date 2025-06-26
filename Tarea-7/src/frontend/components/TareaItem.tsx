import React from "react";
import type { Tarea } from "../types/tarea";
import { useTareasStore } from "../store/TareasStore";
import { useSettingsStore } from "../store/Configuraciones";

interface Props {
  tarea: Tarea;
  onUpdate: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
}

export const TareaItem = ({ tarea, onUpdate, onDelete }: Props) => {
  const { startEditing } = useTareasStore();
  const { uppercase } = useSettingsStore();

  return (
    <li className="tarea">
      <input
        type="checkbox"
        checked={tarea.completed}
        onChange={() =>
          onUpdate({ ...tarea, completed: !tarea.completed })
        }
      />
      <span>
        {uppercase ? tarea.content.toUpperCase() : tarea.content}
      </span>
      <span
        title="Editar tarea"
        className="basura"
        onClick={() => startEditing(tarea.id, tarea.content)}
      >
        ✏️
      </span>
      <span
        title="Eliminar tarea"
        className="basura"
        onClick={() => onDelete(tarea.id)}
      >
        🗑️
      </span>
    </li>
  );
};
