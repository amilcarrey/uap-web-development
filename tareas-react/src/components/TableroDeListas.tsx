import React from "react";
import ListaTareas from "./ListaTareas";
import { useTableros } from "./hooks/useTableros";
import { usePaginatedTareas } from "./hooks/usePaginatedTareas";
import type { Tarea } from "../types";

const TableroDeListas = () => {
  // Hook personalizado para obtener los tableros/listas
  const { data: tableros = [], isLoading: loadingTableros, isError: errorTableros } = useTableros();

  if (loadingTableros) return <p>Cargando tableros...</p>;
  if (errorTableros) return <p>Error al cargar tableros</p>;

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      {/* Aquí podrías agregar lógica para crear tableros usando un hook/mutación */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
        {tableros.map((tablero: { id: string; nombre: string }) => (
          <div key={tablero.id} className="w-full">
            <h2 className="text-xl font-bold text-white mb-2 text-center capitalize">
              {tablero.nombre}
            </h2>
            {/* Hook personalizado para obtener tareas paginadas/filtradas por tablero */}
            <ListaTareas tableroId={tablero.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableroDeListas;