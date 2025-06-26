import { useUIStore } from '../store/useUIStore'

export default function Settings() {
  const refetchInterval = useUIStore(state => state.config.refetchInterval)
  const uppercase = useUIStore(state => state.config.uppercase)
  const setRefetchInterval = useUIStore(state => state.setRefetchInterval)
  const toggleUppercase = useUIStore(state => state.toggleUppercase)

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-orange-500 mb-4">⚙️ Configuraciones</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Intervalo de actualización (ms)</label>
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={uppercase}
          onChange={toggleUppercase}
        />
        <label className="font-medium">Mostrar tareas en mayúsculas</label>
      </div>
    </div>
  )
}
