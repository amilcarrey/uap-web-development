import React, { useEffect, useState } from "react";
import * as api from "../../api/api";

interface UserSettingsType {
  updateInterval: number;
  taskDisplayMode: "compact" | "detailed";
}

export const UserSettings = () => {
  const [settings, setSettings] = useState<UserSettingsType>({
    updateInterval: 60,
    taskDisplayMode: "compact",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getUserSettings();
      setSettings(data);
    } catch {
      setError("No se pudieron cargar las configuraciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === "updateInterval" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await api.updateUserSettings(settings);
      setMessage("Configuraciones guardadas");
    } catch {
      setError("Error al guardar configuraciones");
    }
  };

  if (loading) return <p>Cargando configuraciones...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Configuración Personal</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <label>
        Intervalo de actualización automática (segundos):
        <input
          type="number"
          name="updateInterval"
          value={settings.updateInterval}
          onChange={handleChange}
          min={10}
          max={3600}
          required
        />
      </label>

      <label style={{ marginLeft: 20 }}>
        Modo de visualización de tareas:
        <select
          name="taskDisplayMode"
          value={settings.taskDisplayMode}
          onChange={handleChange}
          style={{ marginLeft: 10 }}
        >
          <option value="compact">Compacto</option>
          <option value="detailed">Detallado</option>
        </select>
      </label>

      <button type="submit" style={{ marginLeft: 20 }}>
        Guardar Configuración
      </button>
    </form>
  );
};
