import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Tablero, tableroService } from '../services/tableroService';
import CrearTableroModal from '../components/CrearTableroModal';
import NotificationContainer from '../components/NotificationContainer';
import { useNotifications } from '../hooks/useNotifications';

const Dashboard: React.FC = () => {
  const { notifications, removeNotification, showSuccess, showError } = useNotifications();
  const [tableros, setTableros] = useState<Tablero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const cargarTableros = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await tableroService.obtenerTableros();
      console.log('📋 Tableros cargados en Dashboard:', response.tableros);
      response.tableros.forEach((tablero: Tablero, index: number) => {
        console.log(`  Tablero ${index + 1}:`, {
          id: tablero.id,
          nombre: tablero.nombre,
          tipoId: typeof tablero.id,
          longitudId: tablero.id?.length
        });
      });
      setTableros(response.tableros);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al cargar tableros';
      setError(errorMsg);
      showError('Error al cargar', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    cargarTableros();
  }, [cargarTableros]);

  const handleTableroCreado = (nuevoTablero: Tablero) => {
    setTableros([...tableros, nuevoTablero]);
    setShowModal(false);
    showSuccess('Tablero creado', 'El nuevo tablero se ha creado correctamente');
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'PROPIETARIO':
        return 'bg-green-100 text-green-800';
      case 'EDITOR':
        return 'bg-blue-100 text-blue-800';
      case 'LECTOR':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Tableros</h1>
            <p className="mt-2 text-gray-600">
              Gestiona tus proyectos y tareas organizadas en tableros
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            + Nuevo Tablero
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lista de tableros */}
        {tableros.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tableros aún</h3>
            <p className="text-gray-500 mb-4">Crea tu primer tablero para comenzar a organizar tus tareas</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Crear mi primer tablero
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tableros.map((tablero) => {
              console.log(`🔗 Creando link para tablero:`, {
                id: tablero.id,
                tipoId: typeof tablero.id,
                longitudId: tablero.id?.length,
                url: `/tablero/${tablero.id}`
              });
              
              return (
                <Link
                  key={tablero.id}
                  to={`/tablero/${encodeURIComponent(tablero.id)}`}
                  className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                  onClick={() => {
                    console.log('🖱️ Click en tablero:', {
                      id: tablero.id,
                      encodedId: encodeURIComponent(tablero.id),
                      url: `/tablero/${encodeURIComponent(tablero.id)}`
                    });
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {tablero.nombre}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(tablero.rolUsuario)}`}>
                        {tablero.rolUsuario}
                      </span>
                    </div>
                    
                    {tablero.descripcion && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {tablero.descripcion}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {tablero._count?.tareas || 0} tareas
                      </span>
                      <span>
                        {new Date(tablero.actualizadoEn).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para crear tablero */}
      {showModal && (
        <CrearTableroModal
          onClose={() => setShowModal(false)}
          onTableroCreado={handleTableroCreado}
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

export default Dashboard;
