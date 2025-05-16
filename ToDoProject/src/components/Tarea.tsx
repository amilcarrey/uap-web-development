
type TareaProps = {
  tarea: {
    id: number;
    descripcion: string;
    completada: boolean;
  };
  onEliminar: (id: number) => void;
  onToggle: (id: number) => void;
};

export default function Tarea({ tarea, onEliminar, onToggle }: TareaProps) {
  const handleEliminar = async () => {
    try {
      const res = await fetch("http://localhost:4321/api/eliminar", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tarea.id }),
      });
      if (res.ok) {
        onEliminar(tarea.id); // Notificás al padre para que actualice la lista
      } else {
        alert("Error al eliminar la tarea");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async () => {
    try {
      const res = await fetch("http://localhost:4321/api/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ id: tarea.id.toString() }),
      });
      if (res.ok) {
        onToggle(tarea.id);
      } else {
        alert("Error al cambiar el estado");
      }
    } catch (err) {
      console.error("Error al hacer toggle:", err);
    }
  };

  return (
    <div
      className="task bg-alpha-50 border-2 bg-pink-400 rounded-lg p-4 my-2 flex items-center justify-between w-[300px] min-h-[50px] overflow-hidden"
      data-id={tarea.id}
    >
      <button onClick={handleEliminar} className="deletemark">
        🗑️
      </button>

      <span className="task-text">{tarea.descripcion}</span>

      <button onClick={handleToggle} className="checkmark">
        {tarea.completada ? "✅" : "⬜"}
      </button>
    </div>
  );
}
