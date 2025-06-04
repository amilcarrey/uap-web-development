import { useUIStore, type Filter } from "../store/useUIStore";
import { useClearCompletedTasks } from "../hooks/useTasks";

export const TaskFilters = () => {
  const clearCompletedTasks = useClearCompletedTasks();
  const filter = useUIStore((state) => state.filter);
  const setFilter = useUIStore((state) => state.setFilter);
  const setOffset = useUIStore((state) => state.setOffset);

  const handleFilterChange = (newFilter: Filter) => {
    setOffset(0); // Reset pagination
    setFilter(newFilter);
  };

  return (
    <div className="flex justify-between mt-4">
      <button
        className="mr-10 bg-gray-500 hover:bg-gray-700 text-white font-light py-0.5 px-2 rounded mt-2"
        onClick={() => clearCompletedTasks.mutate()}
      >
        Limpiar
      </button>
      <button
        onClick={() => handleFilterChange("all")}
        className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
          filter === "all" ? "bg-blue-100" : ""
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => handleFilterChange("activa")}
        className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
          filter === "activa" ? "bg-blue-100" : ""
        }`}
      >
        Activas
      </button>
      <button
        onClick={() => handleFilterChange("completada")}
        className={`hover:bg-blue-50 text-gray-500 font-light underline py-0.5 px-1 rounded mt-2 ml-2 ${
          filter === "completada" ? "bg-blue-100" : ""
        }`}
      >
        Completadas
      </button>
    </div>
  );
};
