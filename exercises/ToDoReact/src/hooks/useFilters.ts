import { useState, useEffect } from "react";
import type { Task } from "./useTasks";

type FilterType = "all" | "active" | "completed";

const API_URL = import.meta.env.VITE_API_URL;

export default function useFilters() {
  const [filter, setFilterState] = useState<FilterType>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilter = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/filter`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const result = await response.json();
      const apiFilter = result.data?.filter || result.filter;

      if (apiFilter === "complete") setFilterState("completed");
      else if (apiFilter === "incomplete") setFilterState("active");
      else setFilterState("all");
    } catch (err) {
      console.error("Error al cargar filtro:", err);
      setError(err instanceof Error ? err.message : "Error al cargar filtro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilter();
  }, []);

  const setFilter = async (newFilter: FilterType) => {
    try {
      let apiFilter: string = newFilter;
      if (newFilter === "completed") apiFilter = "complete";
      if (newFilter === "active") apiFilter = "incomplete";

      const response = await fetch(`${API_URL}/api/filter`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter: apiFilter }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      setFilterState(newFilter);
    } catch (err) {
      console.error("Error al cambiar filtro:", err);
      setError(err instanceof Error ? err.message : "Error al cambiar filtro");
    }
  };

  const filterTasks = (tasks: Task[]) => {
    switch (filter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  };

  return {
    filter,
    loading,
    error,
    setFilter,
    filterTasks,
    fetchFilter,
  };
}
