import React from "react";

// Componente que muestra los botones para seleccionar el filtro de tareas
const Filtros: React.FC<{
  filtro: "all" | "completed" | "incomplete";
  setFiltro: (f: "all" | "completed" | "incomplete") => void;
}> = ({ filtro, setFiltro }) => (
  <div className="filters">
    {/* Botón para mostrar todas las tareas */}
    <button
      onClick={() => setFiltro("all")}
      className={filtro === "all" ? "active" : ""}
    >
      Todas
    </button>
    {/* Botón para mostrar solo completadas */}
    <button
      onClick={() => setFiltro("completed")}
      className={filtro === "completed" ? "active" : ""}
    >
      Completadas
    </button>
    {/* Botón para mostrar solo no completadas */}
    <button
      onClick={() => setFiltro("incomplete")}
      className={filtro === "incomplete" ? "active" : ""}
    >
      No Completadas
    </button>
  </div>
);

export default Filtros;
