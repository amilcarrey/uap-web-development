import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/auth';

interface Settings {
  refreshInterval: number;
  taskViewMode: 'list' | 'grid';
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>({ refreshInterval: 60, taskViewMode: 'list' });
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar configuraciones');
      }
    };

    fetchSettings();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put('/settings', settings);
      setSettings(response.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al actualizar configuraciones');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cerrar sesión');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Configuraciones</h1>
        <button className="btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="refreshInterval">Intervalo de Actualización (segundos)</label>
          <input
            id="refreshInterval"
            type="number"
            min="1"
            value={settings.refreshInterval}
            onChange={(e) => setSettings({ ...settings, refreshInterval: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label htmlFor="taskViewMode">Modo de Vista de Tareas</label>
          <select
            id="taskViewMode"
            value={settings.taskViewMode}
            onChange={(e) => setSettings({ ...settings, taskViewMode: e.target.value as 'list' | 'grid' })}
          >
            <option value="list">Lista</option>
            <option value="grid">Cuadrícula</option>
          </select>
        </div>
        <button type="submit">Guardar Configuraciones</button>
      </form>
    </div>
  );
};

export default Settings;