import { useState, useEffect } from "react";
import { useFondoStore } from "./store/useFondoStore";
import { useConfigStore } from "./store/useConfigStore";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useFondosUsuario } from "./hooks/useFondosUsuario";

export default function Configuracion() {
  // Estado local para sliders y switches
  const [intervalo, setIntervalo] = useState(10000);
  const [porPagina, setPorPagina] = useState(3);
  const [mayuscula, setMayuscula] = useState(false);
  const [nuevoFondo, setNuevoFondo] = useState("");
  const { fondoUrl, setFondoUrl } = useFondoStore();
  type Fondo = { id: string | number; url: string } | string;
  const { fondos, setFondos, loadingFondos } = useFondosUsuario();
  const [guardando, setGuardando] = useState(false);
  const setIntervaloRefetch = useConfigStore((s) => s.setIntervaloRefetch);
  const setDescripcionMayusculas = useConfigStore((s) => s.setDescripcionMayusculas);
  const setTareasPorPagina = useConfigStore((s) => s.setTareasPorPagina);
  const tareaBgColor = useConfigStore((s) => s.tareaBgColor);
  const setTareaBgColor = useConfigStore((s) => s.setTareaBgColor);

  // Recibe la configuración del backend y actualiza el estado local
  function recibirConfigBackend(data: any) {
    if (!data) return;
    if (typeof data.intervaloRefetch === "number") setIntervalo(data.intervaloRefetch);
    if (typeof data.tareasPorPagina === "number") setPorPagina(data.tareasPorPagina);
    if (typeof data.descripcionMayusculas === "boolean") setMayuscula(data.descripcionMayusculas);
    if (typeof data.tareaBgColor === "string") setTareaBgColor(data.tareaBgColor);
  }

  // Guardar configuración en la base de datos
  const guardarConfig = async () => {
    setGuardando(true);
    await axios.post(
      "http://localhost:8008/api/config",
      {
        intervaloRefetch: intervalo,
        tareasPorPagina: porPagina,
        descripcionMayusculas: mayuscula,
        tareaBgColor,
        fondoActual: fondoUrl, // <-- Añade esto
      },
      { withCredentials: true }
    );
    setIntervaloRefetch(intervalo);
    setTareasPorPagina(porPagina);
    setDescripcionMayusculas(mayuscula);
    setTareaBgColor(tareaBgColor);
    setGuardando(false);
    alert("Configuración guardada");
  };

  // Subir fondo (solo vínculo)
  const agregarFondo = async () => {
    if (!nuevoFondo) return;
    const res = await axios.post("http://localhost:8008/api/fondos", { url: nuevoFondo }, { withCredentials: true });
    // El backend debe devolver { ok: true, fondo: { id, url } }
    if (res.data && res.data.fondo) {
      setFondos((prev) => [...prev, res.data.fondo]);
      if (res.data.fondoUrl || res.data.url || res.data.fondo_url) setFondoUrl(res.data.url || (res.data.config && res.data.config.url) || "");
    }
    setNuevoFondo("");
  };

  const eliminarFondo = async (url: string) => {
    // Busca el id del fondo por url (puedes ajustar esto si tienes el id en la respuesta)
    const fondo = fondos.find((f: any) => (typeof f === "object" ? f.url === url : f === url));
    const fondoId = typeof fondo === "object" ? fondo.id : undefined;
    if (!fondoId) return;
    await axios.delete(`http://localhost:8008/api/fondos/${fondoId}`, { withCredentials: true });
    setFondos((prev) => prev.filter((f: any) => (typeof f === "object" ? f.id !== fondoId : f !== url)));
    if (fondoUrl === url) setFondoUrl("");
  };

  // Cargar configuración desde el backend al iniciar
  useEffect(() => {
    axios.get("http://localhost:8008/api/config", { withCredentials: true })
      .then(res => {
        console.log("CONFIG BACKEND:", res.data);
        setFondoUrl(res.data.fondoActual || res.data.fondoUrl || res.data.url || "");
        recibirConfigBackend(res.data);
      })
      .catch(() => {});
  }, []);

  // Puedes poner esto en Configuracion.tsx o donde prefieras
  const handleBorrarCuenta = async () => {
    if (!window.confirm("¿Seguro que deseas borrar tu cuenta? Esta acción es irreversible.")) return;
    try {
      await axios.delete("http://localhost:8008/api/auth/cuenta", { withCredentials: true });
      alert("Cuenta eliminada");
      window.location.href = "/"; // Redirige a landing/login
    } catch (err) {
      alert("Error al borrar la cuenta");
    }
  };

  if (loadingFondos) return <div className="text-center mt-10 text-white">Cargando fondos...</div>;

  return (
    <div>
      <div className="mt-30 max-w-lg mx-auto mt-10 border-white border rounded-xl p-8 shadow-lg backdrop-blur-md text-white">
        <h2 className="text-2xl font-bold mb-6">Configuración</h2>
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Intervalo de actualización (segundos):{" "}
            <span className="font-mono">{intervalo / 1000}s</span>
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60">5s</span>
            <input
              type="range"
              min={5}
              max={60}
              value={intervalo / 1000}
              onChange={(e) => setIntervalo(Number(e.target.value) * 1000)}
              className="w-full accent-blue-500 rounded-lg h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 shadow-inner outline-none transition-all"
              style={{
                background:
                  "linear-gradient(90deg, #3b82f6 " +
                  ((intervalo / 1000 - 5) * 100) / 55 +
                  "%, #374151 " +
                  ((intervalo / 1000 - 5) * 100) / 55 +
                  "%)",
              }}
            />
            <span className="text-xs text-white/60">60s</span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Tareas por página: <span className="font-mono">{porPagina}</span>
          </label>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/60">1</span>
            <input
              type="range"
              min={1}
              max={10}
              value={porPagina}
              onChange={(e) => setPorPagina(Number(e.target.value))}
              className="w-full accent-green-500 rounded-lg h-2 bg-gradient-to-r from-green-400 via-green-600 to-green-800 shadow-inner outline-none transition-all"
              style={{
                background:
                  "linear-gradient(90deg, #22c55e " +
                  ((porPagina - 1) * 100) / 9 +
                  "%, #374151 " +
                  ((porPagina - 1) * 100) / 9 +
                  "%)",
              }}
            />
            <span className="text-xs text-white/60">10</span>
          </div>
        </div>
        <div className="mb-6 flex items-center gap-2">
          <label className="font-semibold">Texto de tareas en mayúscula:</label>
          <input
            type="checkbox"
            checked={mayuscula}
            onChange={(e) => setMayuscula(e.target.checked)}
            className="accent-blue-500"
          />
        </div>
        <div className="mb-6 flex items-center gap-4">
          <label className="font-semibold">Color de fondo de las tareas:</label>
          <input
            type="color"
            value={tareaBgColor}
            onChange={e => setTareaBgColor(e.target.value)}
            className="w-10 h-10 rounded border-2 border-white cursor-pointer"
          />
          <input
            type="text"
            value={tareaBgColor}
            onChange={e => setTareaBgColor(e.target.value)}
            className="border rounded px-2 py-1 w-28 text-black"
            placeholder="#111827"
            maxLength={7}
          />
        </div>
        <button
          onClick={guardarConfig}
          className="bg-black border border-gray-500 text-white px-4 py-2 rounded mb-6"
          disabled={guardando}
        >
          {guardando ? "Guardando..." : "Guardar configuración"}
        </button>
        <hr className="my-6" />
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Agregar fondo (URL de imagen):
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={nuevoFondo}
              onChange={(e) => setNuevoFondo(e.target.value)}
              className="border border-white rounded px-2 py-1 w-full text-white/70"
              placeholder="https://..."
            />
            <button
              onClick={agregarFondo}
              className="bg-green-500 text-white px-3 py-1 rounded"
              type="button"
            >
              Añadir
            </button>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Tus fondos:</label>
          <div className="flex gap-2 flex-wrap">
            {fondos.map((fondo: any) => {
              // Si tu backend devuelve objetos {id, url}, usa fondo.url y fondo.id
              const url = typeof fondo === "object" ? fondo.url : fondo;
              const id = typeof fondo === "object" ? fondo.id : url;
              return (
                <div
                  key={id}
                  className="relative group"
                >
                  <img
                    src={url}
                    alt="Fondo"
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      fondoUrl === url ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => setFondoUrl(url)}
                  />
                  <button
                    type="button"
                    title="Eliminar fondo"
                    onClick={() => eliminarFondo(url)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ zIndex: 2 }}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={handleBorrarCuenta}
          className="bg-red-600 text-white px-4 py-2 rounded mt-8"
        >
          Borrar mi cuenta
        </button>
      </div>
    </div>
  );
}
function recibirConfigBackend(data: any) {
  throw new Error("Function not implemented.");
}

