// Ejemplo TaskFilters.tsx (simplificado)
import type { Dispatch, SetStateAction } from "react";

type Filter = "all" | "active" | "completed";

interface TaskFiltersProps {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
}

export function TaskFilters({ filter, setFilter }: TaskFiltersProps) {
  return (
    <div className="flex justify-center space-x-4 my-4">
      {["all", "active", "completed"].map((f) => (
        <button
          key={f}
          className={`px-3 py-1 rounded ${
            filter === f ? "bg-indigo-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter(f as Filter)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}
