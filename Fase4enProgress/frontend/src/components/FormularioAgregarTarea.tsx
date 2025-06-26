import { useState, useEffect } from "react";
import { useAgregarTarea } from "../hooks/useAgregarTarea";
import { useEditarTarea } from "../hooks/useEditarTarea";
import { useTareaEnEdicionStore } from "../store/useTareaEnEdicionStore";
import React from "react";

type Props = { tableroId: string };

const FormularioAgregarTarea: React.FC<Props> = ({ tableroId }) => {
  const [titulo, setTitulo] = useState("");
  const agregarTarea = useAgregarTarea(tableroId);
  const editarTarea = useEditarTarea();
  const { tarea, cancelar } = useTareaEnEdicionStore();

  useEffect(() => {
    if (tarea) setTitulo(tarea.description);
  }, [tarea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim() === "") return;

    if (tarea) {
      editarTarea.mutate(
        { ...tarea, description: titulo },
        {
          onSuccess: () => {
            setTitulo("");
            cancelar();
          },
        }
      );
    } else {
      agregarTarea.mutate(titulo, {
        onSuccess: () => setTitulo(""),
      });
    }
  };

  const isLoading = agregarTarea.isPending || editarTarea.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder={tarea ? "Editar tarea" : "Nueva tarea"}
        className="flex-1 px-4 py-2 border rounded shadow"
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 rounded transition text-white ${
          isLoading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Guardando..." : tarea ? "Guardar" : "Agregar"}
      </button>
      {tarea && (
        <button
          type="button"
          onClick={() => {
            cancelar();
            setTitulo("");
          }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Cancelar
        </button>
      )}
    </form>
  );
};

export default FormularioAgregarTarea;
