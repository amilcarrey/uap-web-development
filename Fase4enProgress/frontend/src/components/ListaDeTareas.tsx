// src/components/ListaDeTareas.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useTareas } from "../hooks/useTareas";
import { useFiltroStore } from "../store/filtroStore";
import { useToastStore } from "../store/toastStore";
import TareaItem from "./TareaItem";
import { Task } from "../types";
import BorrarCompletadas from "./BorrarCompletadas";  // <-- Importá el componente

type Props = { tableroId: string };

const ListaDeTareas: React.FC<Props> = ({ tableroId }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { filtro } = useFiltroStore();
  const agregarToast = useToastStore((s) => s.agregarToast);

  const { data: tareas = [], isLoading, isError } = useTareas(tableroId, page, limit);

  useEffect(() => {
    if (isError) {
      agregarToast("Error al cargar tareas", "error");
    }
  }, [isError, agregarToast]);

  const tareasFiltradas = useMemo(() => {
    return tareas.filter((t: Task) => {
      if (filtro === "completadas") return t.completed;
      if (filtro === "incompletas") return !t.completed;
      return true;
    });
  }, [tareas, filtro]);

  const hasNext = tareas.length === limit;
  const hasPrev = page > 1;

  return (
    <div>
      {isLoading ? (
        <p className="text-gray-500">Cargando tareas...</p>
      ) : isError ? (
        <p className="text-red-500">No se pudieron cargar las tareas.</p>
      ) : tareasFiltradas.length === 0 ? (
        <p className="text-gray-500">No hay tareas para mostrar.</p>
      ) : (
        <ul className="w-full max-w-md space-y-2">
          {tareasFiltradas.map((t) => (
            <TareaItem key={t.id} tarea={t} />
          ))}
        </ul>
      )}

      {/* Agregá el botón para borrar tareas completadas acá */}
      <div className="mt-4">
        <BorrarCompletadas boardId={tableroId} />
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={!hasPrev}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="self-center">Página {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasNext}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        {/* Input para cambiar el límite */}
        <div>
          <label className="text-sm text-gray-600">
            Tareas por página:&nbsp;
            <input
              type="number"
              min={1}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-2 py-1 border rounded w-20"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ListaDeTareas;
