import React from "react";

function Filtros({ filtroActual, setFiltro }) {
  const filtros = ["todas", "incompletas", "completadas"];

  return (
    <div className="flex justify-center gap-2 my-5">
      {filtros.map(filtro => (
        <button
          key={filtro}
          onClick={() => setFiltro(filtro)}
          className={`px-4 py-2 rounded font-bold border border-pink-300 
            ${filtroActual === filtro ? "bg-pink-300 text-white" : "bg-pink-100 hover:bg-pink-200"}`}
        >
          {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default Filtros;
