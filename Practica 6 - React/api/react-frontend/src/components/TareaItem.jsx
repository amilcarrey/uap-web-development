import React from "react";

function TareaItem({ tarea, index, onCambio }) {
  const toggleTarea = async () => {
    await fetch("http://localhost:4321/api/tasks.json", {
      method: "POST",
      body: new URLSearchParams({
        action: "toggle",
        index: index.toString(),
      }),
    });
    onCambio();
  };

  const borrarTarea = async () => {
    await fetch("http://localhost:4321/api/tasks.json", {
      method: "POST",
      body: new URLSearchParams({
        action: "delete",
        index: index.toString(),
      }),
    });
    onCambio();
  };

  return (
    <li className={`bg-pink-50 w-11/12 max-w-2xl p-3 mx-auto my-4 rounded-lg text-lg border border-pink-200 flex items-center ${tarea.completada ? "opacity-60" : ""}`}>
      <button
        onClick={toggleTarea}
        className="mr-2 cursor-pointer text-lg hover:text-pink-600"
        aria-label={tarea.completada ? "Marcar como pendiente" : "Completar"}
      >
        {tarea.completada ? "✓" : "▢"}
      </button>
      <span className={`flex-grow break-words ${tarea.completada ? "line-through" : ""}`}>
        {tarea.texto}
      </span>
      <button
        onClick={borrarTarea}
        className="bg-red-500 text-white font-bold px-2 py-1 rounded text-center w-10 h-7 hover:bg-red-600 ml-2"
        aria-label="Eliminar tarea"
      >
        X
      </button>
    </li>
  );
}

export default TareaItem;
