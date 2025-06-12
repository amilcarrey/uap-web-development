import { useConfig } from "../hooks/useConfig";
import { useTareas } from "../hooks/useTareas";
import { TareaItem } from "./TareaItem";
import { useState, useEffect } from "react";

interface Props {
  tableroId: string;
}

const PAGE_SIZE = 5;

export function TareaList({ tableroId }: Props) {
  const { refetchInterval } = useConfig();
  const [page, setPage] = useState(1);

  // Reiniciar página cuando cambia el tablero
  useEffect(() => {
    setPage(1);
  }, [tableroId]);

  const { data, isLoading, isError } = useTareas(tableroId, page, PAGE_SIZE, refetchInterval);

  // Ajustar página si supera totalPages (por ejemplo, tras eliminar)
  useEffect(() => {
    if (data && page > Math.ceil(data.total / PAGE_SIZE)) {
      setPage(Math.max(1, Math.ceil(data.total / PAGE_SIZE)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) return <div style={{ textAlign: "center", padding: "1.5em" }}>Cargando tareas...</div>;
  if (isError) return <div style={{ color: "#e33", textAlign: "center" }}>Error al cargar tareas.</div>;

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div>
      <ul className="tarea-lista">
        {data?.tareas.length ? (
          data.tareas.map((t) => (
            <TareaItem key={t.id} tarea={t} />
          ))
        ) : (
          <li style={{ textAlign: "center", color: "#888", fontSize: "1.15em", padding: "1em" }}>
            No hay tareas para mostrar
          </li>
        )}
      </ul>
      <div className="paginacion">
        <span style={{ alignSelf: "center" }}>
          Página: {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
