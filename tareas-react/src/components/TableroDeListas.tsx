// TableroDeListas.tsx
import React, { useState } from "react";
import ListaTareas from "./ListaTareas";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Tarea } from "../types";

const TableroDeListas = () => {
  const [listas, setListas] = useState<string[]>(["personal"]);

  const { data: tareas = [], isLoading, isError } = useQuery({
    queryKey: ["tareas"],
    queryFn: () =>
      axios.get("http://localhost:8008/tareas").then((res) => res.data),
  });

  const agregarLista = () => {
    const nuevaLista = prompt("Nombre de la nueva lista:");
    if (nuevaLista && !listas.includes(nuevaLista)) {
      setListas((prev) => [...prev, nuevaLista]);
    }
  };

  if (isLoading) return <p>Cargando tareas...</p>;
  if (isError) return <p>Error al cargar tareas</p>;

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      <button
        onClick={agregarLista}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
      >
        + Nueva Lista
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
        {listas.map((listaId) => (
          <div key={listaId} className="w-full">
            <h2 className="text-xl font-bold text-white mb-2 text-center capitalize">{listaId}</h2>
            <ListaTareas listaId={listaId} tareas={tareas.filter((t: Tarea) => t.listaId === listaId)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableroDeListas;
