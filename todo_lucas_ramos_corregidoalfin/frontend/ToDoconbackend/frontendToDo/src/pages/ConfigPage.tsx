import { Link } from "react-router";
import { useConfiguracion } from "../components/Configuraciones";

export const ConfigPage = () => {
  const { refetchInterval, descripcionMayusculas, setConfiguracion } =
    useConfiguracion();
  return (
    <div className="font-sans bg-blue-200 min-h-screen">
      <header className="bg-blend-hue text-white p-6 text-center shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-400">Atareado</span>.com
          </h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Configuración</h2>
        <p>Aquí puedes ajustar la configuración de tu aplicación.</p>
      </div>

      <div className="bg-blue-200 max-w-lg mx-auto p-6 shadow-xl rounded-lg-lg mb-6">
        <h2 className="font-bold">Configuración de tareas: </h2>
        <label className="block mb-4">
          <span className="block text-sm">
            Intervalo de refetch (en segundos):
          </span>
          <input
            type="number"
            value={refetchInterval / 1000}
            onChange={(e) =>
              setConfiguracion({
                refetchInterval: Number(e.target.value) * 1000,
              })
            }
            className="mt-1 block w-full p-2 border rounded-lg"
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="block text-sm">Descripción en mayusculas:</span>
          <input
            type="checkbox"
            checked={descripcionMayusculas}
            onChange={(e) =>
              setConfiguracion({ descripcionMayusculas: e.target.checked })
            }
          />
        </label>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Link
          to="/"
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};
