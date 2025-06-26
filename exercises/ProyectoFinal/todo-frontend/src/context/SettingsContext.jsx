import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api/axios';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [prefs, setPrefs] = useState({});

  useEffect(() => {
    api.get('/users/me/settings')
       .then(res => setPrefs(res.data.preferences))
       .catch(() => setPrefs({}));
  }, []);

  const saveSettings = async newPrefs => {
    try {
      const res = await api.put('/users/me/settings', { preferences: newPrefs });
      setPrefs(res.data.preferences);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ prefs, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
