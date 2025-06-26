interface Props {
  filter: "all" | "completed" | "active";
  setFilter: (filter: "all" | "completed" | "active") => void;
}

export default function TaskFilter({ filter, setFilter }: Props) {
  return (
    <div className="mt-4 flex justify-between text-sm text-gray-600">
      <button
        className={filter === "all" ? "font-bold underline" : "hover:underline"}
        onClick={() => setFilter("all")}
      >
        Todas
      </button>
      <button
        className={filter === "active" ? "font-bold underline" : "hover:underline"}
        onClick={() => setFilter("active")}
      >
        Incompletas
      </button>
      <button
        className={filter === "completed" ? "font-bold underline" : "hover:underline"}
        onClick={() => setFilter("completed")}
      >
        Completadas
      </button>
    </div>
  );
}