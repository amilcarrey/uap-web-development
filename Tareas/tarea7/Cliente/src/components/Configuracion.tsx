import { useConfigStore } from "../stores/configStore";

export function Configuracion() {
    const { refetchInterval, setRefetchInterval, upperCaseDescription, setUpperCaseDescription } = useConfigStore();

    return(
        <section>
            <h2 className="text-xl font-bold mb-4">Configuraciones</h2>
            <div className="mb-4">
                <label className="block mb-2">
                    Intervalo de actualización (ms):
                    <input
                        type="number"
                        min="1000"
                        value={refetchInterval}
                        onChange={(e) => setRefetchInterval(Number(e.target.value))}
                        className="ml-2 p-1 border rounded"
                    />
                </label>
                <span className="ml-2 text-sm text-gray-500">
                    (Por defecto: 10000 ms = 10 segundos)
                </span>
            </div>

            <div>
                <label className="flex items-center gap-2 font-medium">
                <input
                    type="checkbox"
                    checked={upperCaseDescription}
                    onChange={e => setUpperCaseDescription(e.target.checked)}
                />
                Descripción en mayúsculas
                </label>
            </div>

                
        </section>
    );
}