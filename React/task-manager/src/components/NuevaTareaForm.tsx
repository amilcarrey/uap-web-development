import { useState, useEffect } from "react";
import { useAgregarTarea } from "../hooks/useAgregarTarea";
import { useEditarTarea } from "../hooks/useEditarTarea";
import type { Tarea } from "../types";
import { useConfigStore } from "../store/configStore";

type Props = {
  tareaEditando?: Tarea;
  cancelarEdicion?: () => void;
};

export function NuevaTareaForm({ tareaEditando, cancelarEdicion }: Props) {
  const [texto, setTexto] = useState("");

  const { mutate: agregarTarea, isPending: agregando } = useAgregarTarea();
  const { mutate: editarTarea, isPending: editando } = useEditarTarea();

  const mayusculas = useConfigStore((s) => s.mayusculas); // ← aplicar formato si está activado

  useEffect(() => {
    if (tareaEditando) {
      setTexto(tareaEditando.texto);
    } else {
      setTexto("");
    }
  }, [tareaEditando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;

    if (tareaEditando) {
      editarTarea(
        { id: tareaEditando.id, texto: limpio },
        { onSuccess: () => cancelarEdicion?.() }
      );
    } else {
      agregarTarea(limpio, { onSuccess: () => setTexto("") });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <input
        type="text"
        placeholder="What do you need to do?"
        value={mayusculas ? texto.toUpperCase() : texto}
        onChange={(e) => setTexto(e.target.value)}
        className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-lg
                   placeholder-gray-400 focus:outline-none focus:border-pink-300"
      />

      <button
        type="submit"
        disabled={agregando || editando}
        className="bg-blue-300 hover:bg-blue-400 text-white font-bold
                   rounded-full px-6 py-3 transition-colors"
      >
        {tareaEditando
          ? editando
            ? "Guardando..."
            : "Guardar"
          : agregando
          ? "Agregando..."
          : "Agregar"}
      </button>

      {tareaEditando && cancelarEdicion && (
        <button
          type="button"
          onClick={cancelarEdicion}
          className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancelar
        </button>
      )}
    </form>
  );
}
