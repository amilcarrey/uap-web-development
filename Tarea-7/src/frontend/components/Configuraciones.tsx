import { useSettingsStore } from "../store/Configuraciones";

export default function Configuraciones() {
  const refetchInterval = useSettingsStore((state) => state.refetchInterval);
  const uppercase = useSettingsStore((state) => state.uppercase);
  const setRefetchInterval = useSettingsStore((state) => state.setRefetchInterval);
  const toggleUppercase = useSettingsStore((state) => state.toggleUppercase);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Configuraciones</h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="refetch" className="font-semibold">
          Intervalo de Refetch (ms):
        </label>
        <input
          id="refetch"
          type="number"
          className="border p-2 rounded-md"
          value={refetchInterval}
          onChange={(e) => setRefetchInterval(Number(e.currentTarget.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="uppercase"
          type="checkbox"
          checked={uppercase}
          onChange={toggleUppercase}
        />
        <label htmlFor="uppercase" className="font-semibold">
          Mostrar descripciones en mayúsculas
        </label>
      </div>
    </div>
  );
}