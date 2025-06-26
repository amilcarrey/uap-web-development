import { useConfigStore } from '../../store/configStore'

function ConfigPage() {
  const {
    refetchInterval,
    mayusculas,
    setRefetchInterval,
    toggleMayusculas,
  } = useConfigStore()

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Configuraciones</h2>

      <div className="mb-4">
        <label className="block">Intervalo de refetch (ms):</label>
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          className="border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block">
          <input
            type="checkbox"
            checked={mayusculas}
            onChange={toggleMayusculas}
          />
          Descripciones en mayúsculas
        </label>
      </div>
    </div>
  )
}

export default ConfigPage
