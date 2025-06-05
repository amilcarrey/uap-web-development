import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [refetchInterval, setRefetchInterval] = useState(10);
  const [uppercase, setUppercase] = useState(false);

  return (
    <SettingsContext.Provider value={{ refetchInterval, setRefetchInterval, uppercase, setUppercase }}>
      {children}
    </SettingsContext.Provider>
  );
} 