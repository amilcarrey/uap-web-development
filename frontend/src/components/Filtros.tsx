// src/components/Filtros.tsx
import React from "react";
import { useFiltroStore } from "../store/filtroStore";

type Filtro = "todas" | "completadas" | "incompletas";

const Filtros: React.FC = () => {
  const { filtro, setFiltro } = useFiltroStore();

  const botones: { id: Filtro; label: string }[] = [
    { id: "todas", label: "Todas" },
    { id: "completadas", label: "Completadas" },
    { id: "incompletas", label: "Incompletas" },
  ];

  return (
    <div className="flex gap-2 my-4">
      {botones.map((btn) => (
        <button
          key={btn.id}
          onClick={() => setFiltro(btn.id)}
          className={`px-4 py-2 rounded border shadow ${
            filtro === btn.id
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default Filtros;
