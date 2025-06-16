import { useActualizarTarea } from "../hooks/useTareas";
import { useUIStore } from "../store/uiStore";
import { useState } from "react";
import { toast } from "react-toastify";

export function EditarTareaForm() {
  const tarea = useUIStore(s => s.tareaEditando);
  const setTareaEditando = useUIStore(s => s.setTareaEditando);
  const actualizarTarea = useActualizarTarea();
  const [descripcion, setDescripcion] = useState(() => tarea?.descripcion ?? "");

  if (!tarea) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descripcion.trim() || !tarea) return;
    actualizarTarea.mutate(
      {
        id: tarea.id,
        descripcion,
        completada: tarea.completada,
        tableroId: tarea.tableroId,
      },
      {
        onSuccess: () => {
          toast.success("Tarea actualizada");
          setTareaEditando(null);
        },
        onError: () => toast.error("Error al actualizar tarea"),
      }
    );
  }

  return (
    <form className="form-row" onSubmit={handleSubmit}>
      <input
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        placeholder="Editar tarea"
        type="text"
      />
      <button type="submit">Guardar</button>
      <button type="button" onClick={() => setTareaEditando(null)}>Cancelar</button>
    </form>
  );
}
