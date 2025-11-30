import { useUIStore } from "../store/useUIStore";

export const FilterButtons = () => {
  const filter = useUIStore((s) => s.filter);
  const setFilter = useUIStore((s) => s.setFilter);

  const makeBtn = (key: "all" | "active" | "completed", label: string) => (
    <button
      key={key}
      onClick={() => setFilter(key)}
      className={`px-3 py-1 rounded text-sm ${
        filter === key ? "bg-green-500 text-white" : "bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex justify-center gap-2 mb-4">
      {makeBtn("all", "All")}
      {makeBtn("active", "Incomplete")}
      {makeBtn("completed", "Complete")}
    </div>
  );
};
