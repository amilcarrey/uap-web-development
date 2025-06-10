import React, { createContext, useContext, useState } from "react";

interface Settings {
  refetchInterval: number; // en milisegundos
  uppercaseDescriptions: boolean;
}

interface SettingsContextProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  showSettingsPage: boolean;
  toggleSettingsPage: () => void;
}

const defaultSettings: Settings = {
  refetchInterval: 10000,
  uppercaseDescriptions: false,
};

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSettingsPage = () => {
    setShowSettingsPage(prev => !prev);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, showSettingsPage, toggleSettingsPage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe usarse dentro de un SettingsProvider");
  }
  return context;
};
