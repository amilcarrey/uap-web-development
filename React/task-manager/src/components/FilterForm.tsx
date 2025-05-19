type FilterFormProps = {
  filtro: string;
  setFiltro: (value: string) => void;
};

export function FilterForm({
  filtro,
  setFiltro,
}: FilterFormProps) {
  return (
    <form className="flex flex-col sm:flex-row w-full justify-between gap-2">
      <select
        className="border border-gray-300 rounded-md p-2"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      >
        <option value="todas">Todas</option>
        <option value="completadas">Completadas</option>
        <option value="incompletas">Incompletas</option>
      </select>
    </form>
  );
}

