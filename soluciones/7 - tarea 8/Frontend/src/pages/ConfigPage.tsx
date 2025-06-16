import { useConfigStore } from "../store/configStore";

export function ConfigPage() {
  const refetchInterval = useConfigStore(s => s.refetchInterval);
  const setRefetchInterval = useConfigStore(s => s.setRefetchInterval);
  const descripcionMayuscula = useConfigStore(s => s.descripcionMayuscula);
  const setDescripcionMayuscula = useConfigStore(s => s.setDescripcionMayuscula);

  return (
    <div>
      <h2>Configuración</h2>
      <label>
        Intervalo de actualización (ms):
        <input
          type="number"
          value={refetchInterval}
          min={1000}
          step={1000}
          onChange={e => setRefetchInterval(Number(e.target.value))}
        />
      </label>
      <br />
      <label>
        Descripción en mayúscula:
        <input
          type="checkbox"
          checked={descripcionMayuscula}
          onChange={e => setDescripcionMayuscula(e.target.checked)}
        />
      </label>
    </div>
  );
}
