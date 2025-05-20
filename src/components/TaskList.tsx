type Tarea = {
  id: number;
  text: string;
  completada: boolean;
};

type Props = {
  tareas: Tarea[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TaskList({ tareas, onToggle, onDelete }: Props) {
  if (tareas.length === 0) {
    return <p className="text-center text-gray-500">No hay tareas</p>;
  }

return (
  <div className="mt-6">
    {tareas.map((t, index) => (
      <div
        key={t.id}
        className={`flex justify-between items-center py-2 ${
          index !== 0 ? "border-t border-gray-200" : ""
        }`}
      >
        <button onClick={() => onToggle(t.id)} className="text-xl">
          {t.completada ? "✓" : "◯"}
        </button>
        <span className={t.completada ? "line-through text-black-400" : ""}>
          {t.text}
        </span>
        <button onClick={() => onDelete(t.id)} className="text-red-500">
          🗑️
        </button>
      </div>
    ))}
  </div>
);
}
