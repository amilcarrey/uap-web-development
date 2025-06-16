import type { Tarea } from "../types";
import { useActualizarTarea, useEliminarTarea } from "../hooks/useTareas";
import { useUIStore } from "../store/uiStore";
import { useConfig } from "../hooks/useConfig";
import { toast } from "react-toastify";

export function TareaItem({ tarea }: { tarea: Tarea }) {
  const actualizarTarea = useActualizarTarea();
  const eliminarTarea = useEliminarTarea();
  const setTareaEditando = useUIStore((s) => s.setTareaEditando);
  const { descripcionMayuscula } = useConfig();

  function handleToggle() {
    actualizarTarea.mutate({ ...tarea, completada: !tarea.completada }, {
      onSuccess: () => toast.success("Tarea actualizada"),
      onError: () => toast.error("Error al actualizar tarea")
    });
  }

  function handleEliminar() {
  eliminarTarea.mutate({ id: tarea.id, tableroId: tarea.tableroId }, {
    onSuccess: () => toast.success("Tarea eliminada"),
    onError: () => toast.error("Error al eliminar tarea"),
  });
}


  return (
    <li className={`tarea-item${tarea.completada ? " completed" : ""}`}>
      <input
        type="checkbox"
        checked={tarea.completada}
        onChange={handleToggle}
        aria-label="Marcar como completada"
      />
      <span
        className="tarea-desc"
        style={{ textTransform: descripcionMayuscula ? "uppercase" : "none" }}
      >
        {tarea.descripcion}
      </span>
      <button onClick={() => setTareaEditando(tarea)}>Editar</button>
      <button onClick={handleEliminar}>Eliminar</button>
    </li>
  );
}
