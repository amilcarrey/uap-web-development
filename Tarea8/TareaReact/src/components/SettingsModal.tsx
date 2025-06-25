import { useEffect, useState } from 'react'
import { useRemoteSettings } from '../hooks/useRemoteSettings'
import { useSettingsStore } from '../stores/settings'

export function SettingsModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { data, isLoading, error, saveSettings, isSaving } = useRemoteSettings()
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(10000)
  const [viewMode, setViewMode] = useState('normal')
  const setRefetchInterval = useSettingsStore(state => state.setRefetchInterval)

  useEffect(() => {
    if (data) {
      setAutoRefreshInterval(data.autoRefreshInterval ?? 10000)
      setViewMode(data.viewMode ?? 'normal')
      // NO actualizar el estado global acá
      // Solo actualizar los estados locales del modal
    }
  }, [data])

  if (!open) return null

  const handleSave = async () => {
    await saveSettings({ autoRefreshInterval, viewMode })
    setRefetchInterval(autoRefreshInterval) // Ahora sí, solo cuando guardás
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">Configuración</h2>
        {isLoading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{(error as Error).message}</p>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Intervalo de refresco (ms):</label>
          <input
            type="number"
            value={autoRefreshInterval}
            min={1000}
            step={1000}
            onChange={e => setAutoRefreshInterval(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Modo de vista:</label>
          <select
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="normal">Normal</option>
            <option value="uppercase">Descripciones en mayúsculas</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={isSaving}
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}