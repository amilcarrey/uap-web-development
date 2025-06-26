import React from "react";
import { useTareasStore } from "../store/TareasStore";

export const FilterForm = () => {
  const search = useTareasStore((s) => s.search);
  const setSearch = useTareasStore((s) => s.setSearch);
  const setPage = useTareasStore((s) => s.setPage);

  const filterEstado = useTareasStore((s) => s.filterEstado);
  const setFilterEstado = useTareasStore((s) => s.setFilterEstado);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  return (
    <div>
      <div className="buscador" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          id="search"
          value={search}
          onChange={onSearchChange}
          placeholder="Buscar tareas..."
        />
      </div>
      <div className="filtros">
        <button
          className={filterEstado === "todas" ? "active" : ""}
          onClick={() => {
            setFilterEstado("todas");
            setPage(1);
          }}
          type="button"
        >
          Todas
        </button>
        <button
          className={filterEstado === "completadas" ? "active" : ""}
          onClick={() => {
            setFilterEstado("completadas");
            setPage(1);
          }}
          type="button"
        >
          Completas
        </button>
        <button
          className={filterEstado === "incompletas" ? "active" : ""}
          onClick={() => {
            setFilterEstado("incompletas");
            setPage(1);
          }}
          type="button"
        >
          Incompletas
        </button>
      </div>
    </div>
  );
};
