import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchUsers, useAllUsers, useBoardSharedUsers } from '../hooks/userSettings';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  permissionId?: number;
  level?: string;
}

interface Props {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareBoardModalComplete({ boardId, isOpen, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);

  // Estado para depuración
  const [debugInfo, setDebugInfo] = useState<any>({});

  // Log inicial para verificar props
  useEffect(() => {
    if (isOpen) {
      console.log('🎯 ShareBoardModalComplete abierto con props:', { boardId, isOpen });
      setDebugInfo(prev => ({ ...prev, modalAbierto: true, boardId }));
    } else {
      setDebugInfo(prev => ({ ...prev, modalAbierto: false }));
    }
  }, [boardId, isOpen]);

  // Obtener usuario actual para excluirlo de la lista
  const currentUser = useAuthStore((state) => state.user);

  // ✅ Hooks para obtener datos - con manejo de errores mejorado
  const { 
    data: allUsers = [], 
    isLoading: allUsersLoading, 
    error: allUsersError 
  } = useAllUsers();
  
  const { 
    data: searchResults = [], 
    isLoading: searchLoading, 
    error: searchError 
  } = useSearchUsers(searchTerm);
  
  const { 
    data: alreadySharedUsers = [], 
    refetch: refetchSharedUsers 
  } = useBoardSharedUsers(boardId);

  // Debug de los hooks
  useEffect(() => {
    const debugData = {
      allUsers: allUsers.length,
      searchResults: searchResults.length,
      searchTerm: searchTerm,
      allUsersLoading,
      searchLoading,
      allUsersError: allUsersError?.message,
      searchError: searchError?.message,
      modalAbierto: isOpen,
      currentUser: currentUser?.alias || 'no usuario'
    };
    
    setDebugInfo(debugData);
    console.log('🔍 Estado de hooks actualizado:', debugData);
    
  }, [allUsers, searchResults, searchTerm, allUsersLoading, searchLoading, allUsersError, searchError, isOpen, currentUser]);

  // Combinar usuarios ya compartidos desde el backend con los locales
  const combinedSharedUsers = useMemo(() => {
    const localIds = sharedUsers.map(u => u.id);
    const backendUsers = alreadySharedUsers.filter(u => !localIds.includes(u.id));
    return [...sharedUsers, ...backendUsers];
  }, [sharedUsers, alreadySharedUsers]);

  // Filtrar usuarios para excluir al usuario actual
  const availableUsers = useMemo(() => {
    const users = searchTerm.length >= 2 ? searchResults : allUsers;
    const filtered = users.filter(user => user.id !== currentUser?.id);
    
    console.log('👥 availableUsers calculado:', {
      origen: searchTerm.length >= 2 ? 'búsqueda' : 'todos',
      filteredLength: filtered.length,
      currentUserId: currentUser?.id
    });
    
    return filtered;
  }, [searchResults, allUsers, searchTerm, currentUser]);

  // Determinar si está cargando
  const isLoading = searchTerm.length >= 2 ? searchLoading : allUsersLoading;

  // Limpiar búsqueda cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleShare = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      
      // Verificar si ya está compartido
      if (combinedSharedUsers.some(u => u.id === user.id)) {
        toast.error(`El tablero ya está compartido con ${user.alias}`);
        return;
      }

      console.log('🔄 Compartiendo tablero con usuario:', user);

      if (!user.id) {
        throw new Error('Error: El usuario no tiene ID válido');
      }

      const requestBody = {
        userId: user.id,
        level: 'EDITOR'
      };

      const response = await fetch(`/api/boards/${boardId}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Tablero compartido exitosamente:', result);

      // Actualizar estado local
      setSharedUsers(prev => [...prev, user]);
      refetchSharedUsers();
      toast.success(`¡Tablero compartido con ${user.alias}!`);
      
      setSearchTerm('');
      
    } catch (error) {
      console.error('❌ Error compartiendo tablero:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al compartir tablero: ${errorMessage}`);
    }
  };

  const handleRemoveShare = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      
      const endpoint = user.permissionId 
        ? `/api/boards/${boardId}/permissions/${user.permissionId}`
        : `/api/boards/${boardId}/permissions/${user.id}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      setSharedUsers(prev => prev.filter(u => u.id !== user.id));
      refetchSharedUsers();
      toast.success(`Se removió el acceso de ${user.alias}`);
      
    } catch (error) {
      console.error('❌ Error removiendo acceso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al remover acceso: ${errorMessage}`);
    }
  };

  if (!isOpen) return null;

  console.log('🎯 ShareBoardModalComplete: RENDERIZANDO');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Compartir Tablero</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[calc(80vh-120px)] overflow-y-auto">
          {/* Panel de depuración */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm font-medium mb-2">🔧 Estado del componente:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Modal abierto: {debugInfo.modalAbierto ? 'SÍ' : 'NO'}</div>
              <div>BoardId: {debugInfo.boardId}</div>
              <div>Usuario actual: {debugInfo.currentUser}</div>
              <div>Usuarios totales: {debugInfo.allUsers}</div>
              <div>Cargando usuarios: {debugInfo.allUsersLoading ? 'SÍ' : 'NO'}</div>
              <div>Error: {debugInfo.allUsersError || 'Ninguno'}</div>
            </div>
          </div>

          {/* Usuarios ya compartidos */}
          {combinedSharedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Usuarios con acceso:</h3>
              <div className="space-y-2">
                {combinedSharedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.alias.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.alias}</p>
                        {(user.firstName || user.lastName) && (
                          <p className="text-sm text-gray-500">
                            {user.firstName} {user.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveShare(user)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Búsqueda de usuarios */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar usuario:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por alias... (opcional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Lista de usuarios disponibles */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {searchTerm.length >= 2 ? 'Resultados de búsqueda:' : 'Usuarios disponibles:'}
            </h3>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500">Cargando usuarios...</p>
                </div>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 rounded-md">
                <p className="text-gray-500">No hay usuarios disponibles</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableUsers.map((user) => {
                  const isAlreadyShared = combinedSharedUsers.some(u => u.id === user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 border rounded-md ${
                        isAlreadyShared 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          isAlreadyShared ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          {user.alias.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.alias}</p>
                          {(user.firstName || user.lastName) && (
                            <p className="text-sm text-gray-500">
                              {user.firstName} {user.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                      {isAlreadyShared ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">
                          ✓ Compartido
                        </span>
                      ) : (
                        <button
                          onClick={() => handleShare(user)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Compartir
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
