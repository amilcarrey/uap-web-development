import { useTareasStore } from "../store/TareasStore";

const FiltrosBusqueda = () => {
  const { search, setSearch } = useTareasStore();


  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Buscar tareas..."
    />
  );
};
