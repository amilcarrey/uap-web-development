import React from "react";
import TareaItem from "./TareaItem";

function ListaDeTareas({ tareas, onCambio }) {
  const handleClearCompleted = async () => {
    await fetch("http://localhost:4321/api/tasks.json", {
      method: "POST",
      body: new URLSearchParams({
        action: "clear",
      }),
    });
    onCambio();
  };

  return (
    <div>
      <ul data-task-list>
        {tareas.map((tarea, i) => (
          <TareaItem key={i} tarea={tarea} index={i} onCambio={onCambio} />
        ))}
      </ul>

      <div className="text-center my-5">
        <button
          onClick={handleClearCompleted}
          className="w-2/5 p-2 bg-pink-200 hover:bg-pink-300 font-bold border border-pink-300 rounded"
        >
          Borrar las tareas completadas
        </button>
      </div>
    </div>
  );
}

export default ListaDeTareas;
