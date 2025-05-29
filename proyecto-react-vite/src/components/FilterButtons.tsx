import { useTaskStore } from "../state/taskStore";

export default function FilterButtons() {
  const filter = useTaskStore((s) => s.filter);
  const setFilter = useTaskStore((s) => s.setFilter);

  type Filter = "all" | "pending" | "completed";

  const filters: { label: string; value: Filter }[] = [
    { label: "Todas", value: "all" },
    { label: "Pendientes", value: "pending" },
    { label: "Completadas", value: "completed" },
  ];

  return (
    <div className="flex gap-2 mb-4 justify-center">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setFilter(f.value)}
          className={`px-4 py-2 rounded ${
            filter === f.value ? "bg-black text-white" : "bg-gray-300"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
