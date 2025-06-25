import { useState, useEffect } from "react";
import { useFondoStore } from "./store/useFondoStore";
import { useConfigStore } from "./store/useConfigStore";
import axios from "axios";

export default function Configuracion() {
  // Estado local para sliders y switches
  const [intervalo, setIntervalo] = useState(10000);
  const [porPagina, setPorPagina] = useState(3);
  const [mayuscula, setMayuscula] = useState(false);
  const [nuevoFondo, setNuevoFondo] = useState("");
  const { fondoUrl, setFondoUrl } = useFondoStore();
  const [fondos, setFondos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const setIntervaloRefetch = useConfigStore((s) => s.setIntervaloRefetch);
  const setDescripcionMayusculas = useConfigStore((s) => s.setDescripcionMayusculas);
  const setTareasPorPagina = useConfigStore((s) => s.setTareasPorPagina);

  // Cargar configuración y fondos del usuario al montar
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:8008/api/config", { withCredentials: true }),
      axios.get("http://localhost:8008/api/fondos", { withCredentials: true }),
    ]).then(([configRes, fondosRes]) => {
      setIntervalo(configRes.data.intervalo_refetch ?? 10000);
      setPorPagina(configRes.data.tareas_por_pagina ?? 3);
      setMayuscula(!!configRes.data.descripcion_mayusculas);
      setFondos(fondosRes.data.fondos ?? []);
      setLoading(false);
    });
  }, []);

  // Guardar configuración en la base de datos
  const guardarConfig = async () => {
    setGuardando(true);
    await axios.post(
      "http://localhost:8008/api/config",
      {
        intervaloRefetch: intervalo,
        tareasPorPagina: porPagina,
        descripcionMayusculas: mayuscula,
      },
      { withCredentials: true }
    );
    setIntervaloRefetch(intervalo);
    setDescripcionMayusculas(mayuscula);
    setTareasPorPagina(porPagina);
    setGuardando(false);
    alert("Configuración guardada");
  };

  // Subir fondo (solo vínculo)
  const agregarFondo = async () => {
    if (!nuevoFondo) return;
    await axios.post("http://localhost:8008/api/fondos", { url: nuevoFondo }, { withCredentials: true });
    setFondos((prev) => [...prev, nuevoFondo]);
    setFondoUrl(nuevoFondo);
    setNuevoFondo("");
  };

  if (loading) return <div className="text-center mt-10">Cargando configuración...</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white/80 rounded-xl p-8 shadow-lg backdrop-blur-md">
      <h2 className="text-2xl font-bold mb-6">Configuración</h2>
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Intervalo de actualización (segundos):{" "}
          <span className="font-mono">{intervalo / 1000}s</span>
        </label>
        <input
          type="range"
          min={5}
          max={60}
          value={intervalo / 1000}
          onChange={(e) => setIntervalo(Number(e.target.value) * 1000)}
          className="w-full accent-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Tareas por página: <span className="font-mono">{porPagina}</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={porPagina}
          onChange={(e) => setPorPagina(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
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
      <button
        onClick={guardarConfig}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
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
            className="border rounded px-2 py-1 w-full"
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
          {fondos.map((url) => (
            <img
              key={url}
              src={url}
              alt="Fondo"
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                fondoUrl === url ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setFondoUrl(url)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}