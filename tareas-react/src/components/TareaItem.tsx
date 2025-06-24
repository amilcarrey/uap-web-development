import React, { useState } from "react";
import { useActualizarTarea } from "./hooks/useActualizarTarea";
import { useToggleCompletada } from "./hooks/useToggleCompletada";
import { useEliminarTarea } from "./hooks/useEliminarTarea";
import { useConfigStore } from "./store/useConfigStore";

type Props = {
  id: string;
  texto: string;
  completada: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
  fecha_realizada?: string | null;
  tableroId?: string;
  descripcionMayusculas: boolean;
};

const CheckIcon = ({ completed }: { completed: boolean }) => (
  <svg
    className={`w-6 h-6 transition-colors duration-300 ${
      completed ? "text-blue-500" : "text-white hover:text-blue-300"
    }`}
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {completed ? (
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    ) : (
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

const TrashIcon = () => (
  <svg
    className="w-6 h-6 text-white hover:text-red-600 transition-colors duration-300 cursor-pointer"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"
    />
  </svg>
);

const TareaItem = ({
  id,
  texto,
  completada,
  fecha_creacion,
  fecha_modificacion,
  fecha_realizada,
  tableroId,
  descripcionMayusculas,
}: Props) => {
  const [editando, setEditando] = useState(false);
  const [nuevoTexto, setNuevoTexto] = useState(texto);

  // Hooks personalizados
  const actualizarTarea = useActualizarTarea(id);
  const toggleCompletada = useToggleCompletada(id, completada);
  const eliminarTarea = useEliminarTarea(tableroId);

  const handleEditarTexto = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (nuevoTexto.trim()) {
        actualizarTarea.mutate({ texto: nuevoTexto });
        setEditando(false);
      } else {
        setNuevoTexto(texto);
        setEditando(false);
      }
    } else if (e.key === "Escape") {
      setNuevoTexto(texto);
      setEditando(false);
    }
  };

  const formatFecha = (fecha?: string | null) => {
    if (!fecha) return "N/A";
    const date = new Date(fecha);
    return isNaN(date.getTime())
      ? "Fecha inválida"
      : date.toLocaleString("es-ES", {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  return (
    <div className="flex flex-col gap-2 bg-black/80 backdrop-blur-lg rounded-xl border border-white/20 p-4 shadow-md shadow-black/20 hover:shadow-lg transition-shadow duration-300 text-white">
      <div className="flex items-center justify-between">
        <button
          onClick={() => toggleCompletada.mutate()}
          aria-label="Toggle complete"
          className="focus:outline-none"
          disabled={toggleCompletada.isPending}
        >
          <CheckIcon completed={completada} />
        </button>

        <div className="flex-1 mx-4 text-center">
          {editando ? (
            <input
              autoFocus
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              onKeyDown={handleEditarTexto}
              onBlur={() => {
                setNuevoTexto(texto);
                setEditando(false);
              }}
              className="bg-transparent border-b border-gray-500 text-white text-center outline-none"
            />
          ) : (
            <p
              className={`font-medium transition-colors duration-300 cursor-pointer ${
                completada ? "line-through text-gray-400" : ""
              }`}
              onClick={() => setEditando(true)}
              title="Haz clic para editar"
            >
              {descripcionMayusculas ? texto.toUpperCase() : texto}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditando(true)}
            aria-label="Edit task"
            className="focus:outline-none"
            disabled={editando}
          >
            <EditIcon />
          </button>

          <button
            onClick={() => eliminarTarea.mutate(id)}
            aria-label="Delete task"
            className="focus:outline-none"
            disabled={eliminarTarea.isPending}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400 flex flex-col sm:flex-row sm:justify-between sm:gap-4">
        <p>Creada: {formatFecha(fecha_creacion)}</p>
        <p>Última modificación: {formatFecha(fecha_modificacion)}</p>
        <p>Realizada: {formatFecha(fecha_realizada)}</p>
      </div>
    </div>
  );
};

export default TareaItem;