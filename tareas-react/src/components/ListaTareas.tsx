import React, { useEffect, useState } from "react";
import TareaItem from "./TareaItem";
import { useUIStore } from "./store/useUIstore";
import { useMatch } from "@tanstack/react-router";
import { tableroRoute } from "../routes/routes";
import { useNotificacionesStore } from "./store/useNotificacionesStore";
import { useConfigStore } from "./store/useConfigStore";
import type { Tarea } from "../types";
import { useAgregarTarea } from "./hooks/useAgregarTarea";
import { useTareasPaginadas } from "./hooks/useTareasPaginadas";

const TAREAS_POR_PAGINA = 3;

const ListaTareas = () => {
  const match = useMatch({ from: tableroRoute.id });
  const tableroId = match?.params.tableroId ?? "";

  const [pagina, setPagina] = useState(1);
  const { data = { tareas: [], totalPaginas: 1 }, isLoading, isError } = useTareasPaginadas(tableroId, pagina, TAREAS_POR_PAGINA);
  console.log("Datos de tareas:", data);
  const { filtro, setFiltro } = useUIStore();
  const [texto, setTexto] = useState("");
  const { agregar: notificar } = useNotificacionesStore();
  const descripcionMayusculas = useConfigStore((state) => state.descripcionMayusculas);
  const agregarTareaMutation = useAgregarTarea(tableroId);

  useEffect(() => {
    if (agregarTareaMutation.isSuccess) {
      setTexto("");
    }
  }, [agregarTareaMutation.isSuccess]);

  // AHORA SÍ, LOS RETURN CONDICIONALES
  if (isLoading) return <p>Cargando tareas...</p>;
  if (isError) return <p>Error al cargar tareas</p>;

  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (texto.trim() === "") return;
    agregarTareaMutation.mutate(texto.trim());
  };

  const tareasFiltradas =
    filtro === "activas"
      ? data?.tareas?.filter((t: Tarea) => !t.completada) ?? []
      : filtro === "completadas"
      ? data?.tareas?.filter((t: Tarea) => t.completada) ?? []
      : data?.tareas ?? [];

  return (
    <div className="bg-gray-150 bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-lg w-[90%] max-w-3xl mx-auto p-8 flex flex-col gap-6 text-gray-800">
      {/* Formulario de nueva tarea */}
      <form onSubmit={agregarTarea} className="flex gap-2 mb-4">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="¿Qué necesitas hacer?"
          className="
            rounded-xl
            h-16
            bg-white bg-opacity-30
            placeholder-gray-300
            text-gray-900
            px-4
            w-full
            focus:outline-none
            transition
            focus:ring-0
            focus:shadow-[0_0_8px_2px_rgba(69,140,255,0.5)]
          "
          disabled={agregarTareaMutation.isPending}
        />
      </form>

      {/* Filtros */}
      <div className="flex gap-4 justify-center">
        {(["todas", "activas", "completadas"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`text-sm font-semibold transition ${
              filtro === f
                ? "text-blue-600 underline underline-offset-4"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de tareas */}
      {tareasFiltradas.length === 0 ? (
        <p className="text-center text-gray-500">No hay tareas para mostrar</p>
      ) : (
        tareasFiltradas.map((tarea: Tarea) => (
          <TareaItem
            key={tarea.id}
            {...tarea}
            fecha_creacion={tarea.fecha_creacion ?? ""}
            fecha_modificacion={tarea.fecha_modificacion ?? ""}
            fecha_realizada={tarea.fecha_realizada ?? ""}
            tableroId={tarea.tableroId ?? ""}
            descripcionMayusculas={descripcionMayusculas}
          />
        ))
      )}

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPagina(Math.max(1, pagina - 1))}
          disabled={pagina === 1}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
            pagina === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          ← Anterior
        </button>

        <span className="text-gray-400 font-medium">
          {pagina} de {data.totalPaginas}
        </span>

        <button
          onClick={() => setPagina(Math.min(data.totalPaginas, pagina + 1))}
          disabled={!data || pagina === data.totalPaginas}
          className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
            pagina === data.totalPaginas
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default ListaTareas;