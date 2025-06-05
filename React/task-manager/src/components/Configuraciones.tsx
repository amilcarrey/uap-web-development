import { useConfigStore } from "../store/configStore";

export default function Configuraciones() {
  const {
    refetchInterval,
    setRefetchInterval,
    mayusculas,
    setMayusculas,
  } = useConfigStore();

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold mb-4">Configuraciones</h2>

      {/* Intervalo de refetch */}
      <div>
        <label className="block font-medium mb-1">
          Intervalo de actualización automática (milisegundos):
        </label>
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={refetchInterval}
          min={1000}
          step={1000}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
        />
      </div>

      {/* Mayúsculas */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="mayusculas"
          checked={mayusculas}
          onChange={(e) => setMayusculas(e.target.checked)}
        />
        <label htmlFor="mayusculas" className="font-medium">
          Mostrar descripciones en MAYÚSCULAS
        </label>
      </div>
    </div>
  );
}
