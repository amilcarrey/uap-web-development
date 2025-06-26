import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext"; 
import { API_URL } from "../components/TaskManager";

// Definición de la configuración que se maneja
type Settings = {
  refetchInterval: number;          // Intervalo para refrescar datos en ms
  descripcionMayusculas: boolean;   // Mostrar descripción en mayúsculas o no
  theme: "light" | "dark";          // Tema de la aplicación
};

// Tipo del contexto que se exporta
type SettingsContextType = {
  settings: Settings | null;                                        // Configuración actual o null si no hay
  setSettings: React.Dispatch<React.SetStateAction<Settings | null>>;  // Setter para configuración
  loading: boolean;                                                 // Estado de carga (fetch)
  error: string | null;                                             // Error en fetch o update
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>; // Función para actualizar configuración parcial
};

// Crear contexto con valor inicial undefined para forzar uso dentro del provider
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Componente proveedor del contexto de configuración
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading: authLoading } = useAuth(); // Obtener token y estado de autenticación

  // Estados internos
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para cargar configuración al cambiar el token o cuando la autenticación esté lista
  useEffect(() => {
    if (authLoading) return; // Esperar a que la autenticación termine

    if (!token) {
      // Si no hay token (logout), limpiar estados
      setSettings(null);
      setError(null);
      setLoading(false);
      return;
    }

    // Si hay token, iniciar carga de configuración
    setLoading(true);
    setError(null);

    async function fetchSettings() {
      try {
        const res = await fetch(`${API_URL}/api/configuraciones/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar configuración");
        const data: Settings = await res.json();
        setSettings(data);
        setError(null);
      } catch (err) {
        setSettings(null);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();

  }, [token, authLoading]);

  // Función para actualizar configuración en backend y en estado
  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!token) {
      throw new Error("No autenticado");
    }

    try {
      const res = await fetch(`${API_URL}/api/configuraciones/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error("Error al actualizar configuración");
      const updated: Settings = await res.json();
      setSettings(updated);
    } catch (err) {
      throw err;
    }
  };

  // Proveer los valores y funciones a los hijos
  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading, error, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings debe usarse dentro de un SettingsProvider");
  return context;
};
