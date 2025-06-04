'use client';
import { useConfigStore } from '@/stores/configStore';

export default function ConfiguracionPage() {
  const {
    refetchInterval,
    mayusculas,
    setRefetchInterval,
    setMayusculas,
  } = useConfigStore();

  return (
    <main className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-cyan-700 text-center">Configuraciones</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Intervalo de Refetch (segundos)</label>
          <input
            type="number"
            min={1}
            value={refetchInterval / 1000}
            onChange={(e) => setRefetchInterval(Number(e.target.value) * 1000)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Descripción en Mayúsculas</span>
          <input
            type="checkbox"
            checked={mayusculas}
            onChange={(e) => setMayusculas(e.target.checked)}
            className="w-5 h-5"
          />
        </div>
      </div>
    </main>
  );
}
