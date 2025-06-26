import React, { useEffect, useMemo, useState } from "react";
import TareaItem from "./TareaItem";
import { useUIStore } from "./store/useUIstore";
import { useMatch } from "@tanstack/react-router";
import { tableroRoute } from "../routes/routes";
import { useNotificacionesStore } from "./store/useNotificacionesStore";
import { useConfigStore } from "./store/useConfigStore";
import type { Tarea } from "../types";
import { useTareas } from "./hooks/useTareas";
import { useEliminarCompletadas } from "./hooks/useEliminarCompletadas";
import { ModalCompartir } from "./ModalCompartir";
import { FaShareAlt } from "react-icons/fa";
import { useRolTablero } from "./hooks/useRolTablero";
import { useTareaAction } from "./hooks/useTareaAction";

const ListaTareas = () => {
  const match = useMatch({ from: tableroRoute.id });
  const tableroId = match?.params.tableroId ?? "";

  const [pagina, setPagina] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const porPagina = useConfigStore((s) => s.tareasPorPagina);

  // Reiniciar página cuando cambia el tablero seleccionado o la cantidad por página
  useEffect(() => {
    setPagina(1);
  }, [tableroId, porPagina]);

  // Usa porPagina en el hook de tareas
  const { data = { tareas: [], totalPaginas: 1 }, isLoading } = useTareas({ tableroId, pagina, porPagina });

  // Cuando cambian las tareas, si la página actual queda vacía y no es la 1, retrocede una página
  useEffect(() => {
    if (
      data?.tareas &&
      data.tareas.length === 0 &&
      pagina > 1
    ) {
      setPagina(pagina - 1);
    }
  }, [data?.tareas, pagina]);

  const { filtro, setFiltro } = useUIStore();
  const [texto, setTexto] = useState("");
  const { agregar: notificar } = useNotificacionesStore();
  const tareaAction = useTareaAction(notificar);
  const descripcionMayusculas = useConfigStore((state) => state.descripcionMayusculas);
  const eliminarCompletadasMutation = useEliminarCompletadas(tableroId, notificar);
  const { data: rol, isLoading: loadingRol } = useRolTablero(tableroId);

  const [mostrarModal, setMostrarModal] = useState(false);

  // Limpiar input al agregar tarea exitosamente
  useEffect(() => {
    if (tareaAction.isSuccess && tareaAction.variables?.type === "add") {
      setTexto("");
    }
  }, [tareaAction.isSuccess, tareaAction.variables]);

  // Filtrado de tareas
  const tareasFiltradas = useMemo(() => {
    if (!data?.tareas) return [];
    let filtradas = data.tareas;
    if (filtro === "activas") {
      filtradas = filtradas.filter((t: Tarea) => !t.completada);
    }
    if (filtro === "completadas") {
      filtradas = filtradas.filter((t: Tarea) => t.completada);
    }
    if (busqueda.trim() !== "") {
      filtradas = filtradas.filter((t: Tarea) =>
        t.texto.toLowerCase().includes(busqueda.trim().toLowerCase())
      );
    }
    return filtradas;
  }, [data?.tareas, filtro, busqueda]);

  if (isLoading) return <p>Cargando tareas...</p>;
  if (loadingRol) return <p>Cargando permisos...</p>;
  if (!rol) return <p>No tienes acceso a este tablero.</p>;

  // Agregar tarea usando el hook genérico
  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (texto.trim() === "") return;
    tareaAction.mutate({ type: "add", tableroId, texto: texto.trim() });
  };

  const handleEliminarCompletadas = () => {
    if (!window.confirm("¿Eliminar todas las tareas completadas?")) return;
    eliminarCompletadasMutation.mutate();
  };

  return (
    <>
      {/* Botón de compartir fuera del contenedor principal */}
      <div className="w-full flex justify-end mx-auto ">
        <button
          title="Compartir tablero"
          onClick={() => setMostrarModal(true)}
          className="text-white hover:text-blue-200 text-2xl -mb-15"
        >
          <FaShareAlt />
        </button>
      </div>

      {/* Contenedor flex para lista y modal */}
      <div className="flex w-full justify-center">
        {/* Lista de tareas */}
        <div className="backdrop-blur-md bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-lg w-[90%] max-w-3xl mx-auto p-8 flex flex-col gap-6 text-gray-500">
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
            border-white
            placeholder-white/30
            text-white/50
            px-4
            w-full
            focus:outline-none
            transition
            focus:ring-0
            focus:shadow-[0_0_8px_2px_rgba(69,140,255,0.5)]
          "
              disabled={tareaAction.isPending}
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
                    ? "text-blue-500 underline underline-offset-4"
                    : "text-white/50 hover:text-blue-500"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Barra de búsqueda */}
          <div className="flex justify-center mt-2 mb-4">
            <input
              type="text"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar tarea por texto..."
              className="rounded-lg px-3 py-1 w-full max-w-xs border border-white/20 bg-black/20 text-white placeholder-white/40 focus:outline-none"
            />
          </div>

          {/* Lista de tareas */}
          {!tareasFiltradas.length ? (
            <p className="text-center text-white/50">No hay tareas para mostrar</p>
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
                rol={rol}
              />
            ))
          )}

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1 || isLoading}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors border border-white/20
      ${pagina === 1 || isLoading
        ? "bg-transparent text-gray-400 cursor-not-allowed"
        : "bg-black/80 text-white hover:bg-black/90"
      }`}
              style={{ backgroundColor: pagina === 1 ? "transparent" : undefined }}
            >
              ← Anterior
            </button>

            <span className="text-gray-400 font-medium">
              {pagina} de {data?.totalPaginas ?? 1}
            </span>

            <button
              onClick={() => setPagina(p => Math.min((data?.totalPaginas ?? 1), p + 1))}
              disabled={isLoading || pagina >= (data?.totalPaginas ?? 1)}
              className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors border border-white/20
      ${pagina >= (data?.totalPaginas ?? 1) || isLoading
        ? "bg-transparent text-gray-400 cursor-not-allowed"
        : "bg-black/80 text-white hover:bg-black/90"
      }`}
              style={{ backgroundColor: (pagina >= (data?.totalPaginas ?? 1)) ? "transparent" : undefined }}
            >
              Siguiente →
            </button>
          </div>

          {/* Botón para eliminar tareas completadas solo para editores y propietarios */}
          {(rol === "editor" || rol === "propietario") && (
            <button
              onClick={handleEliminarCompletadas}
              className="ml-6 text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded transition"
            >
              Eliminar completadas
            </button>
          )}
        </div>

        {/* Modal de compartir a la derecha */}
        {mostrarModal && (
          <div className="relative">
            <div className="fixed inset-0 z-40" onClick={() => setMostrarModal(false)} />
            <div className="z-50 relative">
              <ModalCompartir
                tableroId={tableroId}
                onClose={() => setMostrarModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ListaTareas;