import { useSettingsStore } from '../stores/settings'


export function SettingsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { refetchInterval, setRefetchInterval, uppercaseDescriptions, toggleUppercaseDescriptions } = useSettingsStore()

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">Configuración</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Intervalo de refresco (ms):</label>
          <input
            type="number"
            value={refetchInterval}
            min={1000}
            step={1000}
            onChange={e => setRefetchInterval(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercaseDescriptions}
              onChange={toggleUppercaseDescriptions}
            />
            Descripciones en mayúsculas
          </label>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}