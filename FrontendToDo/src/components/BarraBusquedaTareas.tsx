import { useState } from "react";
import { useBuscarTareas } from "../hooks/useTareas";
import Tarea from "./Tarea";

export default function BarraBusquedaTareas() {
  const [query, setQuery] = useState("");
  const { data: tareas, isLoading } = useBuscarTareas(query);

  return (
    <div className="mb-4 max-w-md w-full mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar tareas por descripción..."
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 w-full"
      />
      {isLoading && <p>Buscando...</p>}
      {query && tareas && (
        <div className="mt-2 flex flex-col items-center">
          {tareas.length === 0 && <p>No se encontraron tareas.</p>}
          {tareas.map((tarea: any) => (
            <Tarea key={tarea.id} tarea={tarea} />
          ))}
        </div>
      )}
    </div>
  );
}