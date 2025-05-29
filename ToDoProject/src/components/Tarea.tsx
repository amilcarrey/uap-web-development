import { useState } from "react";
import { useEliminarTareaMutation, useToggleTareaMutation, useEditarTareaMutation } from "../hooks/useTareas";
import { useClientStore } from "../store/clientStore";
import type { TareaType } from "../types/Tarea";

type TareaProps = {
  tarea: TareaType;
};

export default function Tarea({ tarea }: TareaProps) {
  const [editando, setEditando] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState(tarea.descripcion);
  
  const { mostrarToast } = useClientStore();
  const eliminarMutation = useEliminarTareaMutation();
  const toggleMutation = useToggleTareaMutation();
  const editarMutation = useEditarTareaMutation();

  const handleEliminar = () => {
    eliminarMutation.mutate(tarea.id, {
      onSuccess: () => mostrarToast("Tarea eliminada", "exito"),
      onError: () => mostrarToast("Error al eliminar", "error"),
    });
  };

  const handleToggle = () => {
    toggleMutation.mutate(tarea.id, {
      onError: () => mostrarToast("Error al cambiar estado", "error"),
    });
  };

  const handleEditar = () => setEditando(true);

  const guardarDescripcion = () => {
    const nuevaDesc = nuevaDescripcion.trim();
    if (!nuevaDesc || nuevaDesc === tarea.descripcion) {
      setEditando(false);
      return;
    }
    
    editarMutation.mutate({ id: tarea.id, descripcion: nuevaDesc }, {
      onSuccess: () => {
        mostrarToast("Tarea editada", "exito");
        setEditando(false);
      },
      onError: () => mostrarToast("Error al editar", "error"),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      guardarDescripcion();
    }
  };

  return (
    <div
      className="task bg-alpha-50 border-2 bg-pink-400 rounded-lg p-4 my-2 flex items-center justify-between w-[300px] min-h-[50px] overflow-hidden"
      data-id={tarea.id}
    >
      <div className="flex gap-2 items-center">
        <button onClick={handleEliminar} className="deletemark">
          🗑️
        </button>
        <button onClick={handleToggle} className="checkmark">
          {tarea.completada ? "✅" : "⬜"}
        </button>
      </div>

      {editando ? (
        <input
          className="task-input border rounded px-2"
          value={nuevaDescripcion}
          onChange={(e) => setNuevaDescripcion(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="task-text">{tarea.descripcion}</span>
      )}

      <button onClick={handleEditar} className="editmark">
        🖋️
      </button>
    </div>
  );
}