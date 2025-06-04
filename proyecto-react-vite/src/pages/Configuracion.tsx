import { useConfigStore } from "../state/configStore";

export default function Configuracion() {
  const refetchInterval = useConfigStore((s) => s.refetchInterval);
  const setRefetchInterval = useConfigStore((s) => s.setRefetchInterval);
  const mayusculas = useConfigStore((s) => s.mayusculas);
  const toggleMayusculas = useConfigStore((s) => s.toggleMayusculas);

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Configuraciones</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Intervalo de Refetch (en segundos):
        </label>
        <input
          type="number"
          value={refetchInterval / 1000}
          onChange={(e) =>
            setRefetchInterval(Number(e.target.value) * 1000)
          }
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Mostrar descripción en mayúsculas:
        </label>
        <input
          type="checkbox"
          checked={mayusculas}
          onChange={toggleMayusculas}
          className="w-5 h-5"
        />
      </div>
    </div>
  );
}
