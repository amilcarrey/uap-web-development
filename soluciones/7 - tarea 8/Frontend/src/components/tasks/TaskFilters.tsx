import React, { useState } from "react";

interface Props {
  onSearchChange: (search: string) => void;
  onFilterChange: (filter: "all" | "completed" | "pending") => void;
}

export const TaskFilters = ({ onSearchChange, onFilterChange }: Props) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    onSearchChange(val);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "all" | "completed" | "pending";
    setFilter(val);
    onFilterChange(val);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar tareas"
        value={search}
        onChange={handleSearchChange}
      />
      <select value={filter} onChange={handleFilterChange}>
        <option value="all">Todas</option>
        <option value="completed">Completadas</option>
        <option value="pending">Pendientes</option>
      </select>
    </div>
  );
};
