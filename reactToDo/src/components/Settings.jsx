import { useClientStore } from '../stores/clientStore';

export default function Settings() {
  const { settings, setRefetchInterval, setUppercaseDescriptions } = useClientStore();

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Configuraciones</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Intervalo de Refetch de Tareas (ms)</label>
        <input
          type="number"
          min={1000}
          step={1000}
          value={settings.refetchInterval}
          onChange={e => setRefetchInterval(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full"
        />
        <span className="text-xs text-gray-500">Por defecto: 10000 ms (10 segundos)</span>
      </div>
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="uppercaseDescriptions"
          checked={settings.uppercaseDescriptions}
          onChange={e => setUppercaseDescriptions(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="uppercaseDescriptions" className="font-medium">
          Descripción en mayúsculas
        </label>
      </div>
    </div>
  );
}