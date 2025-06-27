import React, { createContext, useContext, useState } from 'react';

interface SettingsContextType {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
  setRefetchInterval: (interval: number) => void;
  setUppercaseDescriptions: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refetchInterval, setRefetchInterval] = useState<number>(10_000); // 10 segundos por defecto
  const [uppercaseDescriptions, setUppercaseDescriptions] = useState<boolean>(false);

  return (
    <SettingsContext.Provider
      value={{
        refetchInterval,
        uppercaseDescriptions,
        setRefetchInterval,
        setUppercaseDescriptions,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de un SettingsProvider');
  }
  return context;
};