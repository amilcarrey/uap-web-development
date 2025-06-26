import useConfigStore from '../../store/configStore'

function SettingsPage() {
  const {
    refetchInterval,
    showUppercase,
    setRefetchInterval,
    toggleUppercase,
  } = useConfigStore()

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Configuraciones</h2>

      <label>
        Intervalo de actualización (ms):
        <input
          type="number"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.target.value))}
          className="ml-2 border p-1"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showUppercase}
          onChange={toggleUppercase}
        />
        Descripción en mayúsculas
      </label>
    </div>
  )
}

export default SettingsPage
