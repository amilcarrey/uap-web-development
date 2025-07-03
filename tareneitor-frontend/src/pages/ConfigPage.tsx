import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { BackButton } from "../components/BackButton";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  restablecerConfiguracion,
} from "../api/configuracionService";
import type { ConfiguracionUsuario } from "../api/configuracionService";

export function ConfigPage() {
  const [config, setConfig] = useState<ConfiguracionUsuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Cargar configuración al inicio
  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await obtenerConfiguracion();
        setConfig(data);
        setError(null);
      } catch (err) {
        setError("Error al obtener configuración");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // Maneja cambios en inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!config) return;
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    setConfig({
      ...config,
      [name]: type === "checkbox" ? (target as HTMLInputElement).checked : type === "number" ? Number(value) : value,
    });
  }

  // Guardar cambios
  async function handleGuardar() {
    if (!config) return;
    setGuardando(true);
    try {
      const updated = await actualizarConfiguracion(config);
      setConfig(updated);
      setError(null);
      alert("Configuración actualizada");
    } catch {
      setError("Error al guardar configuración");
    } finally {
      setGuardando(false);
    }
  }

  // Restablecer configuración
  async function handleRestablecer() {
    if (!confirm("¿Restablecer configuración a valores por defecto?")) return;
    setGuardando(true);
    try {
      const restablecida = await restablecerConfiguracion();
      setConfig(restablecida);
      setError(null);
      alert("Configuración restablecida");
    } catch {
      setError("Error al restablecer configuración");
    } finally {
      setGuardando(false);
    }
  }

  if (loading) return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto mt-20">
        <p>Cargando configuración...</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto mt-20">
        <BackButton />
        <p className="text-red-600">{error}</p>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto mt-20">
        <BackButton />
        <h1 className="text-2xl font-bold mb-6">Configuraciones</h1>

        <div className="space-y-4 text-black">
          <div>
            <label className="block font-semibold mb-1" htmlFor="auto_refresh_interval">
              Intervalo de actualización automática (segundos)
            </label>
            <input
              type="number"
              id="auto_refresh_interval"
              name="auto_refresh_interval"
              value={config?.auto_refresh_interval ?? ""}
              onChange={handleChange}
              min={5}
              className="border p-2 rounded w-full"
              disabled={guardando}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="tema">
              Tema
            </label>
            <select
              id="tema"
              name="tema"
              value={config?.tema ?? ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={guardando}
            >
              <option value="claro">Claro</option>
              <option value="oscuro">Oscuro</option>
            </select>
          </div>

          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="notificaciones"
                checked={config?.notificaciones ?? false}
                onChange={handleChange}
                disabled={guardando}
                className="mr-2"
              />
              Recibir notificaciones
            </label>
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="idioma">
              Idioma
            </label>
            <select
              id="idioma"
              name="idioma"
              value={config?.idioma ?? ""}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              disabled={guardando}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              {/* Agrega más idiomas si querés */}
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Guardar cambios
            </button>
            <button
              onClick={handleRestablecer}
              disabled={guardando}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Restablecer valores por defecto
            </button>
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
}
