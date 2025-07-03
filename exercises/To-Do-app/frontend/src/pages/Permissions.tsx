import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/auth';

interface Permission {
  id: number;
  userId: number;
  boardId: number;
  role: 'owner' | 'editor' | 'viewer';
  user: { email: string };
}

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPermissions = async () => {
      try {
        const response = await api.get(`/boards/${boardId}/permissions`);
        console.log('Permisos recibidos:', response.data); // Depuración
        setPermissions(response.data.permissions || []);
      } catch (err: any) {
        console.error('Error al cargar permisos:', err); // Depuración
        setError(err.response?.data?.error || 'Error al cargar permisos');
      }
    };

    fetchPermissions();
  }, [user, boardId, navigate]);

  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post(`/boards/${boardId}/permissions`, { email, role });
      console.log('Permiso añadido:', response.data); // Depuración
      setPermissions([...permissions, response.data.permission]);
      setEmail('');
      setRole('editor');
      setError('');
    } catch (err: any) {
      console.error('Error al agregar permiso:', err); // Depuración
      setError(err.response?.data?.error || 'Error al agregar permiso');
    }
  };

  const handleDeletePermission = async (userId: number) => {
    try {
      await api.delete(`/boards/${boardId}/permissions/${userId}`);
      console.log(`Permiso eliminado para userId ${userId}`); // Depuración
      setPermissions(permissions.filter((p) => p.userId !== userId));
      setError('');
    } catch (err: any) {
      console.error('Error al eliminar permiso:', err); // Depuración
      setError(err.response?.data?.error || 'Error al eliminar permiso');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err: any) {
      console.error('Error al cerrar sesión:', err); // Depuración
      setError(err.response?.data?.error || 'Error al cerrar sesión');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Permisos del Tablero</h1>
        <button className="btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleAddPermission}>
        <div>
          <label htmlFor="email">Email del usuario</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Rol</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Lector</option>
          </select>
        </div>
        <button type="submit">Agregar Permiso</button>
      </form>
      <div className="grid">
        {permissions.length === 0 ? (
          <p>No hay permisos asignados.</p>
        ) : (
          permissions.map((permission) => (
            <div key={permission.id} className="card">
              <p>Usuario: {permission.user.email}</p>
              <p>Rol: {permission.role === 'owner' ? 'Propietario' : permission.role === 'editor' ? 'Editor' : 'Lector'}</p>
              {permission.role !== 'owner' && (
                <button
                  className="btn-danger"
                  onClick={() => handleDeletePermission(permission.userId)}
                >
                  Eliminar Permiso
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Permissions;