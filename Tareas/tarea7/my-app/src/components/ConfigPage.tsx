import { useConfigStore } from '../store/configStore';

export const ConfigPage: React.FC = () => {
  const {
    refetchInterval,
    setRefetchInterval,
  } = useConfigStore();

  return (
    <div>
      <h2>Configuraciones</h2>
      <div>
        <label>
          Intervalo de Refetch (ms):
          <input
            type="number"
            value={refetchInterval}
            onChange={(e) => setRefetchInterval(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Descripciones en mayúsculas:
          <input
            type="checkbox"
          />
        </label>
      </div>
    </div>
  );
};
