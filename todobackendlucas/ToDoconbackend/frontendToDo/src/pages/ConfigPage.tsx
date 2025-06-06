import { Link } from "react-router";
import { useConfiguracion } from "../components/Configuraciones";



export const ConfigPage = () => {
  const { refetchInterval, descripcionMayusculas, setConfiguracion } = useConfiguracion();

  return (
    <div className="bg-gradient-to-tr from-[#232526] to-[#414345] min-h-screen py-10">
      <div className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl shadow-2xl bg-white/10 border border-white/20 backdrop-blur">
        <div className="flex items-center gap-3 mb-6">
          
          <h2 className="text-3xl font-bold text-orange-500 tracking-tight drop-shadow">
            Configuración
          </h2>
        </div>
        
        <form className="space-y-8">
          <div>
            <label className="flex items-center gap-4 text-base font-medium text-gray-200 mb-2">
              Intervalo de actualización (segundos)
            </label>
            <input
              type="number"
              value={refetchInterval / 1000}
              min={1}
              max={300}
              onChange={(e) =>
                setConfiguracion({ refetchInterval: Number(e.target.value) * 1000 })
              }
              className="w-full px-4 py-2 rounded-xl bg-gray-900/90 text-white focus:ring-2 focus:ring-orange-400 border border-gray-700 shadow-sm outline-none transition"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="desc-mayus"
              checked={descripcionMayusculas}
              onChange={(e) =>
                setConfiguracion({ descripcionMayusculas: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-400 focus:ring-orange-400 accent-orange-500"
            />
            <label htmlFor="desc-mayus" className="text-gray-200 text-base cursor-pointer">
              Mostrar descripciones en MAYÚSCULAS
            </label>
          </div>
        </form>
      </div>

      <div className="max-w-2xl mx-auto flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all duration-150"
          title="Volver a la página principal"
          aria-label="Volver a la página principal"
        >
          {/* <Home className="w-5 h-5" /> */}
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};
