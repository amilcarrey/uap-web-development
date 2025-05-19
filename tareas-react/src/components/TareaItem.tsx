import React from "react";

type Props = {
  texto: string;
  completada: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const TareaItem = ({ texto, completada, onToggle, onDelete }: Props) => {
  return (
    <div className="contenedor-tarea flex items-center justify-between border-b-2 border-black py-2">
      <button onClick={onToggle} className="check text-xl">
        {completada ? "✅" : "⭕"}
      </button>
      <p className={`flex-1 text-center px-4 ${completada ? "line-through text-gray-400" : ""}`}>
        {texto}
      </p>
      <button onClick={onDelete} className="eliminar text-xl">
        🗑️
      </button>
    </div>
  );
};

export default TareaItem;
