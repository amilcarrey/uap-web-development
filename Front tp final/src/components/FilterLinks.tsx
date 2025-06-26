
import { useTaskStore } from "../store/taskStore"

const filters = [
  { key: "all", label: "Todas" },
  { key: "incomplete", label: "Pendientes" },
  { key: "completed", label: "Hechas" },
]

export default function FilterLinks() {
  const currentFilter = useTaskStore((s) => s.filter)
  const setFilter = useTaskStore((s) => s.setFilter)

  return (
    <div className="flex gap-3 justify-center mt-6" data-current-filter={currentFilter}>
      {filters.map((f) => {
        const active = f.key === currentFilter
        return (
          <a
            key={f.key}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setFilter(f.key)
            }}
            className={
              "px-4 py-2 rounded-full " +
              (active
                ? "bg-rose-600 text-white"
                : "border border-rose-500 text-rose-500 hover:bg-rose-50")
            }
          >
            {f.label}
          </a>
        )
      })}
    </div>
  )
}
