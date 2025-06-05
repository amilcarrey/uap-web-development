import { useConfigStore } from "../store/configStore";

export default function ConfigPage() {
  const {
    refetchInterval,
    uppercaseDescriptions,
    setRefetchInterval,
    toggleUppercase,
  } = useConfigStore();

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Configuraciones</h1>

      <label className="block mb-4">
        <span className="block mb-1">Intervalo de refetch (milisegundos)</span>
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          className="border px-2 py-1 rounded w-full"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={uppercaseDescriptions}
          onChange={toggleUppercase}
        />
        <span>Mostrar descripciones en mayúsculas</span>
      </label>
    </div>
  );
}
