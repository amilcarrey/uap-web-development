import { createContext, useContext, useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

type Settings = {
  uppercaseDescriptions: boolean;
  refetchInterval: number;
};

type SettingsContextType = {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleSettingsPage: () => void;
  showSettingsPage: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    uppercaseDescriptions: false,
    refetchInterval: 5000,
  });
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings`, { credentials: "include" })
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);

    fetch(`${API_BASE}/api/settings`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSettings),
    });
  };

  const toggleSettingsPage = () => setShowSettingsPage(!showSettingsPage);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, showSettingsPage, toggleSettingsPage }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
}
