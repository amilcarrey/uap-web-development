import { useCrearTarea } from "../hooks/useTareas";
import { useState } from "react";
import { toast } from "react-toastify";

export function NuevoTareaForm({ tableroId }: { tableroId: string }) {
  const crearTarea = useCrearTarea();
  const [descripcion, setDescripcion] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!descripcion.trim()) return;
    crearTarea.mutate(
      { descripcion, completada: false, tableroId },
      {
        onSuccess: () => {
          toast.success("Tarea agregada");
          setDescripcion("");
        },
        onError: () => toast.error("Error al agregar tarea"),
      }
    );
  }

  return (
    <form className="form-row" onSubmit={handleSubmit}>
      <input
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        placeholder="Nueva tarea"
        type="text"
      />
      <button type="submit">Agregar</button>
    </form>
  );
}
