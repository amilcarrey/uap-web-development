import { useTareasStore } from "../../store/TareasStore";

export const FilterForm = () => {
  const search = useTareasStore((s) => s.search);
  const setSearch = useTareasStore((s) => s.setSearch);

  return (
    <div className="buscador">
      <input
        type="text"
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar tareas..."
      />
    </div>
  );
};
