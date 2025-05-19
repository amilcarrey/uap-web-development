import React from "react";
import TareaItem from "./TareaItem";

type Tarea = {
  texto: string;
  completada: boolean;
};

type Props = {
  tareas: Tarea[];
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
  onClearCompleted: () => void;
};

const ListaTareas = ({ tareas, onToggle, onDelete, onClearCompleted }: Props) => {
  return (
    <div className="bg-green-700 p-8 text-white rounded-3xl w-[90%] mx-auto flex flex-col gap-4">
      {tareas.map((tarea, index) => (
        <TareaItem
          key={index}
          texto={tarea.texto}
          completada={tarea.completada}
          onToggle={() => onToggle(index)}
          onDelete={() => onDelete(index)}
        />
      ))}

      <button
        onClick={onClearCompleted}
        className="self-end mt-4 text-lime-200 border-none bg-transparent p-4 cursor-pointer"
      >
        Eliminar Tareas Completadas
      </button>
    </div>
  );
};

export default ListaTareas;
