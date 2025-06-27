import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tablero as TableroType, tableroService } from '../services/tableroService';
import { Tarea, tareaService } from '../services/tareaService';
import CrearTareaModal from '../components/CrearTareaModal';
import ConfirmModal from '../components/ConfirmModal';
import CompartirTableroModal from '../components/CompartirTableroModal';
import NotificationContainer from '../components/NotificationContainer';
import { useNotifications } from '../hooks/useNotifications';

const Tablero: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  

  const [tablero, setTablero] = useState<TableroType | null>(null);
  const [todasLasTareas, setTodasLasTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  const [prioridadFiltro, setPrioridadFiltro] = useState<string>('');
  const [completadaFiltro, setCompletadaFiltro] = useState<string>('');
  const [busquedaFiltro, setBusquedaFiltro] = useState<string>('');
  

  const [showTareaModal, setShowTareaModal] = useState(false);
  const [tareaEditando, setTareaEditando] = useState<Tarea | undefined>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tareaEliminar, setTareaEliminar] = useState<Tarea | null>(null);
  const [operacionLoading, setOperacionLoading] = useState<string | null>(null);
  const [showCompartirModal, setShowCompartirModal] = useState(false);
  const [permisosTablero, setPermisosTablero] = useState<any[]>([]);


  useEffect(() => {
    console.log('🔍 === DEBUGGING TABLERO COMPONENT ===');
    console.log('🔍 useParams raw id:', id);
    console.log('🔍 Tipo del id de useParams:', typeof id);
    console.log('🔍 Longitud del id:', id?.length);
    console.log('🔍 Caracteres del id:', id?.split(''));
    console.log('🔍 URL actual:', window.location.href);
    console.log('🔍 pathname:', window.location.pathname);
  }, [id]);


  const cargarDatos = useCallback(async () => {
    const rawId = id;
    const decodedId = rawId ? decodeURIComponent(rawId) : null;
    
    console.log('🔍 ID recibido de useParams:', {
      rawId: rawId,
      decodedId: decodedId,
      tipoRaw: typeof rawId,
      tipoDecoded: typeof decodedId,
      longitudRaw: rawId?.length,
      longitudDecoded: decodedId?.length,
      esUndefined: rawId === undefined,
      esNull: rawId === null,
      esVacio: rawId === '',
      caracteresIndividualesRaw: rawId ? rawId.split('') : 'No hay ID',
      caracteresIndividualesDecoded: decodedId ? decodedId.split('') : 'No hay ID'
    });

    if (!decodedId) {
      setError('ID del tablero es requerido');
      setLoading(false);
      return;
    }


    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(decodedId)) {
      console.error('❌ ID inválido recibido:', {
        id: decodedId,
        formato: 'UUID esperado: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        longitudEsperada: 36,
        longitudActual: decodedId.length,
        caracteresEspeciales: decodedId.match(/[^a-f0-9-]/gi) || 'Ninguno',
        posicionesDashes: decodedId.split('').map((char, index) => char === '-' ? index : null).filter(pos => pos !== null)
      });
      setError(`ID del tablero inválido: ${decodedId}`);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('✅ ID válido, cargando tablero con ID:', decodedId);
      

      const [tableroResponse, tareasResponse] = await Promise.all([
        tableroService.obtenerTablero(decodedId),
        tareaService.obtenerTareas(decodedId, {})
      ]);
      
      console.log('✅ Datos cargados:', { 
        tablero: tableroResponse.tablero?.nombre, 
        tareas: tareasResponse.tareas?.length 
      });
      
      setTablero(tableroResponse.tablero);
      setTodasLasTareas(tareasResponse.tareas || []);
      
    } catch (err: any) {
      console.error('❌ Error cargando datos:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Error al cargar los datos';
      setError(errorMessage);
      
      if (err.response?.status === 404) {
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);


  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);


  const tareasFiltradas = React.useMemo(() => {
    let resultado = [...todasLasTareas];
    

    if (prioridadFiltro) {
      resultado = resultado.filter(t => t.prioridad === prioridadFiltro);
    }
    

    if (completadaFiltro !== '') {
      const esCompletada = completadaFiltro === 'true';
      resultado = resultado.filter(t => t.completada === esCompletada);
    }
    

    if (busquedaFiltro.trim()) {
      const busqueda = busquedaFiltro.toLowerCase().trim();
      resultado = resultado.filter(t => 
        t.titulo.toLowerCase().includes(busqueda) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(busqueda))
      );
    }
    
    return resultado;
  }, [todasLasTareas, prioridadFiltro, completadaFiltro, busquedaFiltro]);


  const handleNuevaTarea = () => {
    setTareaEditando(undefined);
    setShowTareaModal(true);
  };

  const handleEditarTarea = (tarea: Tarea) => {
    setTareaEditando(tarea);
    setShowTareaModal(true);
  };

  const handleEliminarTarea = (tarea: Tarea) => {
    setTareaEliminar(tarea);
    setShowConfirmModal(true);
  };

  const handleTareaGuardada = (tarea: Tarea) => {
    if (tareaEditando) {

      setTodasLasTareas(prev => prev.map(t => t.id === tarea.id ? tarea : t));
      showSuccess('Tarea actualizada', 'La tarea se ha actualizado correctamente');
    } else {

      setTodasLasTareas(prev => [tarea, ...prev]);
      showSuccess('Tarea creada', 'La nueva tarea se ha creado correctamente');
    }
    setShowTareaModal(false);
    setTareaEditando(undefined);
  };

  const confirmarEliminarTarea = async () => {
    if (!tareaEliminar) return;

    try {
      setOperacionLoading(`eliminar-${tareaEliminar.id}`);
      await tareaService.eliminarTarea(tareaEliminar.id);
      setTodasLasTareas(prev => prev.filter(t => t.id !== tareaEliminar.id));
      showSuccess('Tarea eliminada', 'La tarea se ha eliminado correctamente');
    } catch (err: any) {
      showError('Error al eliminar', err.response?.data?.error || 'No se pudo eliminar la tarea');
    } finally {
      setOperacionLoading(null);
      setShowConfirmModal(false);
      setTareaEliminar(null);
    }
  };

  const toggleCompletarTarea = async (tarea: Tarea) => {
    try {
      setOperacionLoading(`toggle-${tarea.id}`);
      const response = await tareaService.actualizarTarea(tarea.id, {
        completada: !tarea.completada
      });
      setTodasLasTareas(prev => prev.map(t => t.id === tarea.id ? response.tarea : t));
      showSuccess(
        response.tarea.completada ? 'Tarea completada' : 'Tarea marcada como pendiente',
        response.tarea.completada ? 'La tarea se ha marcado como completada' : 'La tarea se ha marcado como pendiente'
      );
    } catch (err: any) {
      showError('Error al actualizar', err.response?.data?.error || 'No se pudo actualizar la tarea');
    } finally {
      setOperacionLoading(null);
    }
  };

  const handleEliminarCompletadas = async () => {
    const decodedId = id ? decodeURIComponent(id) : null;
    if (!decodedId || !tablero) return;
    
    const tareasCompletadas = todasLasTareas.filter(t => t.completada).length;
    
    if (tareasCompletadas === 0) {
      showError('Sin tareas completadas', 'No hay tareas completadas para eliminar');
      return;
    }

    if (!window.confirm(`¿Estás seguro de que quieres eliminar ${tareasCompletadas} tarea(s) completada(s)?`)) {
      return;
    }

    try {
      setOperacionLoading('eliminar-completadas');
      const response = await tareaService.eliminarTareasCompletadas(decodedId);
      
      setTodasLasTareas(prev => prev.filter(t => !t.completada));
      showSuccess('Tareas eliminadas', `Se eliminaron ${response.tareasEliminadas} tareas completadas`);
    } catch (err: any) {
      showError('Error al eliminar', err.response?.data?.error || 'Error al eliminar tareas completadas');
    } finally {
      setOperacionLoading(null);
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'URGENTE':
        return 'text-red-600 bg-red-100';
      case 'ALTA':
        return 'text-orange-600 bg-orange-100';
      case 'MEDIA':
        return 'text-yellow-600 bg-yellow-100';
      case 'BAJA':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const limpiarFiltros = () => {
    setPrioridadFiltro('');
    setCompletadaFiltro('');
    setBusquedaFiltro('');
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tablero...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (!tablero) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No se pudo cargar el tablero</p>
        </div>
      </div>
    );
  }

  const hayFiltrosActivos = prioridadFiltro || completadaFiltro || busquedaFiltro.trim();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Encabezado del tablero */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tablero.nombre}</h1>
              {tablero.descripcion && (
                <p className="mt-2 text-gray-600">{tablero.descripcion}</p>
              )}
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>Rol: {tablero.rolUsuario}</span>
                <span>Tareas: {tareasFiltradas.length} de {todasLasTareas.length}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ← Volver al Dashboard
              </button>
              
              {tablero.rolUsuario === 'PROPIETARIO' && (
                <button
                  onClick={() => setShowCompartirModal(true)}
                  className="px-4 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium"
                >
                  🔗 Compartir
                </button>
              )}
              
              {tablero.rolUsuario !== 'LECTOR' && (
                <button 
                  onClick={handleNuevaTarea}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  + Nueva Tarea
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow border">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={prioridadFiltro}
              onChange={(e) => setPrioridadFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todas las prioridades</option>
              <option value="URGENTE">Urgente</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
            
            <select
              value={completadaFiltro}
              onChange={(e) => setCompletadaFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Todas las tareas</option>
              <option value="false">Pendientes</option>
              <option value="true">Completadas</option>
            </select>
            
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={busquedaFiltro}
              onChange={(e) => setBusquedaFiltro(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 min-w-0"
            />
            
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
              >
                Limpiar Filtros
              </button>
            )}
            
            {tablero.rolUsuario !== 'LECTOR' && todasLasTareas.some(t => t.completada) && (
              <button
                onClick={handleEliminarCompletadas}
                disabled={operacionLoading === 'eliminar-completadas'}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md text-sm font-medium transition-colors"
              >
                {operacionLoading === 'eliminar-completadas' ? 'Eliminando...' : 'Eliminar Completadas'}
              </button>
            )}
          </div>
        </div>

        {/* Lista de tareas */}
        {tareasFiltradas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hayFiltrosActivos ? 'No hay tareas que coincidan con los filtros' : 'No hay tareas'}
            </h3>
            <p className="text-gray-500 mb-4">
              {tablero.rolUsuario === 'LECTOR' 
                ? 'Este tablero no tiene tareas aún'
                : hayFiltrosActivos
                  ? 'Intenta cambiar los filtros para ver más tareas'
                  : 'Crea tu primera tarea para comenzar'
              }
            </p>
            {tablero.rolUsuario !== 'LECTOR' && !hayFiltrosActivos && (
              <button
                onClick={handleNuevaTarea}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Crear mi primera tarea
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tareasFiltradas.map((tarea) => (
              <div
                key={tarea.id}
                className={`bg-white p-4 rounded-lg shadow border-l-4 ${
                  tarea.completada ? 'border-green-400 bg-gray-50' : 'border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Checkbox para completar/incompletar */}
                    {tablero.rolUsuario !== 'LECTOR' && (
                      <button
                        onClick={() => toggleCompletarTarea(tarea)}
                        disabled={operacionLoading === `toggle-${tarea.id}`}
                        className={`mt-1 w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          tarea.completada 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        } ${operacionLoading === `toggle-${tarea.id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {operacionLoading === `toggle-${tarea.id}` ? (
                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                        ) : tarea.completada ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : null}
                      </button>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-medium ${tarea.completada ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {tarea.titulo}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(tarea.prioridad)}`}>
                          {tarea.prioridad}
                        </span>
                        {tarea.completada && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completada
                          </span>
                        )}
                      </div>
                      
                      {tarea.descripcion && (
                        <p className={`mt-2 text-sm ${tarea.completada ? 'text-gray-400' : 'text-gray-600'}`}>
                          {tarea.descripcion}
                        </p>
                      )}
                      
                      <div className="mt-2 text-xs text-gray-500">
                        Creada: {new Date(tarea.creadoEn).toLocaleDateString()}
                        {tarea.completadoEn && (
                          <span className="ml-4">
                            Completada: {new Date(tarea.completadoEn).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {tablero.rolUsuario !== 'LECTOR' && (
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => handleEditarTarea(tarea)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleEliminarTarea(tarea)}
                        disabled={operacionLoading === `eliminar-${tarea.id}`}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                      >
                        {operacionLoading === `eliminar-${tarea.id}` ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {showTareaModal && id && (
        <CrearTareaModal
          tableroId={decodeURIComponent(id)}
          tarea={tareaEditando}
          onClose={() => {
            setShowTareaModal(false);
            setTareaEditando(undefined);
          }}
          onTareaGuardada={handleTareaGuardada}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Eliminar Tarea"
        message={`¿Estás seguro de que quieres eliminar la tarea "${tareaEliminar?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmButtonColor="red"
        onConfirm={confirmarEliminarTarea}
        onCancel={() => {
          setShowConfirmModal(false);
          setTareaEliminar(null);
        }}
        loading={operacionLoading === `eliminar-${tareaEliminar?.id}`}
      />

      {/* Modal de compartir tablero */}
      {showCompartirModal && tablero && (
        <CompartirTableroModal
          tableroId={tablero.id}
          tableroNombre={tablero.nombre}
          permisos={permisosTablero}
          onClose={() => setShowCompartirModal(false)}
          onPermisosActualizados={setPermisosTablero}
        />
      )}

      {/* Notificaciones */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
};

export default Tablero;
