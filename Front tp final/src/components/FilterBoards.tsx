
import { useBoardStore } from "../store/boardStore"; 

const filters: { key: "all" | "owned" | "shared"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "owned", label: "Míos" },
  { key: "shared", label: "Compartidos" },
];

export default function FilterBoards() {
  const currentFilter = useBoardStore((s) => s.filter);
  const setFilter = useBoardStore((s) => s.setFilter);

  return (
    <div className="flex gap-3 justify-center mt-6" data-current-filter={currentFilter}>
      {filters.map((f) => {
        const active = f.key === currentFilter;
        return (
          <a
            key={f.key}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setFilter(f.key);
            }}
            className={
              "px-4 py-2 rounded-full " +
              (active
                ? "bg-pink-600 text-white"
                : "border border-pink-500 text-pink-500 hover:bg-pink-50")
            }
          >
            {f.label}
          </a>
        );
      })}
    </div>
  );
}