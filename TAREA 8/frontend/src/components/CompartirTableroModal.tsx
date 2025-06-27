import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { tableroService } from '../services/tableroService';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

interface PermisoTablero {
  id: string;
  usuarioId: number;
  rol: 'EDITOR' | 'LECTOR';
  usuario: Usuario;
}

interface CompartirTableroModalProps {
  tableroId: string;
  tableroNombre: string;
  permisos: PermisoTablero[];
  onClose: () => void;
  onPermisosActualizados: (permisos: PermisoTablero[]) => void;
}

const CompartirTableroModal: React.FC<CompartirTableroModalProps> = ({
  tableroId,
  tableroNombre,
  permisos,
  onClose,
  onPermisosActualizados
}) => {
  const { showSuccess, showError } = useNotifications();
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<'EDITOR' | 'LECTOR'>('LECTOR');
  const [loading, setLoading] = useState(false);
  const [loadingPermisos, setLoadingPermisos] = useState(true);
  const [permisosLocales, setPermisosLocales] = useState<PermisoTablero[]>([]);


  useEffect(() => {
    const cargarPermisos = async () => {
      try {
        setLoadingPermisos(true);
        const tableroActualizado = await tableroService.obtenerTablero(tableroId);
        const permisosFormateados = (tableroActualizado.tablero as any).permisos?.map((permiso: any) => ({
          id: permiso.id.toString(),
          usuarioId: permiso.usuario.id,
          rol: permiso.rol as 'EDITOR' | 'LECTOR',
          usuario: permiso.usuario
        })) || [];
        
        setPermisosLocales(permisosFormateados);
        onPermisosActualizados(permisosFormateados);
      } catch (error) {
        console.error('Error al cargar permisos:', error);
        showError('Error', 'No se pudieron cargar los permisos del tablero');
      } finally {
        setLoadingPermisos(false);
      }
    };

    cargarPermisos();
  }, [tableroId, showError, onPermisosActualizados]);

  const handleCompartir = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      showError('Error', 'El email es requerido');
      return;
    }

    try {
      setLoading(true);
      

      await tableroService.compartirTablero(tableroId, {
        emailUsuario: email.trim(),
        rol
      });
      

      const tableroActualizado = await tableroService.obtenerTablero(tableroId);
      const nuevosPermisos = (tableroActualizado.tablero as any).permisos?.map((permiso: any) => ({
        id: permiso.id.toString(),
        usuarioId: permiso.usuario.id,
        rol: permiso.rol as 'EDITOR' | 'LECTOR',
        usuario: permiso.usuario
      })) || [];
      
      setPermisosLocales(nuevosPermisos);
      onPermisosActualizados(nuevosPermisos);
      
      setEmail('');
      setRol('LECTOR');
      showSuccess('Tablero compartido', `El tablero se ha compartido con ${email.trim()}`);
      
    } catch (err: any) {
      console.error('Error al compartir tablero:', err);
      showError('Error al compartir', err.response?.data?.error || 'Error al compartir el tablero');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarRol = async (permisoId: string, nuevoRol: 'EDITOR' | 'LECTOR') => {
    try {

      const permiso = permisosLocales.find(p => p.id === permisoId);
      if (!permiso) {
        showError('Error', 'Permiso no encontrado');
        return;
      }


      await tableroService.actualizarRolPermiso(tableroId, permiso.usuario.email, nuevoRol);
      

      const nuevosPermisos = permisosLocales.map(p => 
        p.id === permisoId ? { ...p, rol: nuevoRol } : p
      );
      
      setPermisosLocales(nuevosPermisos);
      onPermisosActualizados(nuevosPermisos);
      showSuccess('Rol actualizado', 'El rol del usuario se ha actualizado');
      
    } catch (err: any) {
      console.error('Error al cambiar rol:', err);
      showError('Error', err.response?.data?.error || 'Error al cambiar el rol');
    }
  };

  const handleEliminarPermiso = async (permisoId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres revocar el acceso a este usuario?')) {
      return;
    }

    try {

      const permiso = permisosLocales.find(p => p.id === permisoId);
      if (!permiso) {
        showError('Error', 'Permiso no encontrado');
        return;
      }


      await tableroService.eliminarPermiso(tableroId, permiso.usuarioId);
      

      const nuevosPermisos = permisosLocales.filter(p => p.id !== permisoId);
      setPermisosLocales(nuevosPermisos);
      onPermisosActualizados(nuevosPermisos);
      showSuccess('Acceso revocado', 'Se ha revocado el acceso al usuario');
      
    } catch (err: any) {
      console.error('Error al revocar acceso:', err);
      showError('Error', err.response?.data?.error || 'Error al revocar el acceso');
    }
  };

  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800';
      case 'LECTOR':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Compartir "{tableroNombre}"
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario para compartir */}
        <form onSubmit={handleCompartir} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compartir con usuario
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as 'EDITOR' | 'LECTOR')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="LECTOR">Solo lectura</option>
                <option value="EDITOR">Editor</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium transition-colors"
              >
                {loading ? 'Compartiendo...' : 'Compartir'}
              </button>
            </div>
          </div>
        </form>

        {/* Lista de usuarios con acceso */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Usuarios con acceso ({permisosLocales.length})
          </h3>
          
          {loadingPermisos ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando permisos...</span>
            </div>
          ) : permisosLocales.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Este tablero no se ha compartido con ningún usuario
            </p>
          ) : (
            <div className="space-y-3">
              {permisosLocales.map((permiso) => (
                <div key={permiso.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {permiso.usuario.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {permiso.usuario.nombre}
                      </p>
                      <p className="text-xs text-gray-500">
                        {permiso.usuario.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={permiso.rol}
                      onChange={(e) => handleCambiarRol(permiso.id, e.target.value as 'EDITOR' | 'LECTOR')}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="LECTOR">Solo lectura</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                    
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRolColor(permiso.rol)}`}>
                      {permiso.rol}
                    </span>
                    
                    <button
                      onClick={() => handleEliminarPermiso(permiso.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Revocar acceso"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompartirTableroModal;
