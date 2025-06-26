// src/pages/SettingsPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext }      from '../context/AuthContext';
import { SettingsContext }  from '../context/SettingsContext';

export default function SettingsPage() {
  const { logout } = useContext(AuthContext);
  const { prefs, saveSettings } = useContext(SettingsContext);
  const [localPrefs, setLocalPrefs] = useState({ view: 'list', refreshInterval: 0 });
  const navigate = useNavigate();

  // Cuando cambian los prefs globales, sincronizamos el local
  useEffect(() => {
    setLocalPrefs({
      view: prefs.view || 'list',
      refreshInterval: prefs.refreshInterval ?? 0
    });
  }, [prefs]);

  const handleSave = async () => {
    const ok = await saveSettings(localPrefs);
    alert(ok ? 'Guardado correctamente' : 'Error al guardar');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-md mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Configuraciones</h2>
        <Link to="/" className="text-blue-600 hover:underline">← Mis Tableros</Link>
      </header>

      <div className="space-y-4">
        {/* Vista */}
        <div>
          <label className="block mb-1 font-medium">Vista</label>
          <select
            className="w-full p-2 border border-gray-400 rounded focus:outline-none"
            value={localPrefs.view}
            onChange={e => setLocalPrefs({ ...localPrefs, view: e.target.value })}
          >
            <option value="list">Lista</option>
            <option value="kanban">Kanban</option>
          </select>
        </div>

        {/* Intervalo refresco */}
        <div>
          <label className="block mb-1 font-medium">Intervalo refresco (s)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-400 rounded focus:outline-none"
            value={localPrefs.refreshInterval}
            onChange={e => setLocalPrefs({ 
              ...localPrefs, 
              refreshInterval: Number(e.target.value) 
            })}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-grow bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded"
          >
            Guardar
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex-grow bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
