import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchUsers, useAllUsers, useBoardSharedUsers, useUpdateBoardPermission } from '../hooks/userSettings';
import { useAuthStore } from '../stores/authStore';
import { getPermissionDisplayText, frontendToBackendPermission } from '../types/permissions';

interface User {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  permissionId?: number;
  level?: string;
}

interface ShareBoardContentProps {
  boardId: string;
}

export function ShareBoardContent({ boardId }: ShareBoardContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);
  const [selectedPermissionLevel, setSelectedPermissionLevel] = useState<'EDITOR' | 'VIEWER'>('EDITOR');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Helper function para obtener inicial de usuario de forma segura
  const getUserInitial = (user: User): string => {
    if (!user) return '?';
    
    let name = user.alias;
    if (!name || name.trim() === '') {
      name = user.firstName;
    }
    if (!name || name.trim() === '') {
      name = user.lastName;
    }
    if (!name || name.trim() === '') {
      name = 'Usuario';
    }
    
    return name.charAt(0).toUpperCase();
  };

  // Helper function para obtener el nombre completo del usuario
  const getUserDisplayName = (user: User): string => {
    if (!user) return 'Usuario desconocido';
    
    if (user.alias && user.alias.trim() !== '') {
      return user.alias;
    }
    
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    if (fullName !== '') {
      return fullName;
    }
    
    return 'Sin nombre';
  };

  // Obtener usuario actual para excluirlo de la lista
  const currentUser = useAuthStore((state) => state.user);

  // Hooks para obtener datos
  const { 
    data: allUsers = [], 
    isLoading: allUsersLoading
  } = useAllUsers();
  
  const { 
    data: searchResults = [], 
    isLoading: searchLoading
  } = useSearchUsers(searchTerm);
  
  const { 
    data: alreadySharedUsers = [], 
    refetch: refetchSharedUsers 
  } = useBoardSharedUsers(boardId);

  // Hook para actualizar permisos
  const updatePermissionMutation = useUpdateBoardPermission();

  // Combinar usuarios ya compartidos desde el backend con los locales
  const combinedSharedUsers = useMemo(() => {
    const localIds = sharedUsers.map(u => u.id);
    const backendUsers = alreadySharedUsers
      .filter(u => u && u.id)
      .filter(u => !localIds.includes(u.id));
    return [...sharedUsers, ...backendUsers];
  }, [sharedUsers, alreadySharedUsers]);

  // Filtrar usuarios para excluir al usuario actual
  const availableUsers = useMemo(() => {
    const users = searchTerm.length >= 2 ? searchResults : allUsers;
    const filtered = users
      .filter(user => user.id !== currentUser?.id)
      .filter(user => user && user.id)
      .filter(user => user.alias || user.firstName || user.lastName);
    
    return filtered;
  }, [searchResults, allUsers, searchTerm, currentUser]);

  // Determinar si está cargando
  const isLoading = searchTerm.length >= 2 ? searchLoading : allUsersLoading;

  // Limpiar búsqueda cuando se cierra el modal
  useEffect(() => {
    if (!boardId) {
      setSearchTerm('');
    }
  }, [boardId]);

  const handleShare = async (user: User) => {
    try {
      const token = localStorage.getItem('token');
      
      if (combinedSharedUsers.some(u => u.id === user.id)) {
        toast.error(`El tablero ya está compartido con ${getUserDisplayName(user)}`);
        return;
      }

      if (!user.id) {
        throw new Error('Error: El usuario no tiene ID válido');
      }

      const requestBody = {
        userId: user.id,
        level: frontendToBackendPermission(selectedPermissionLevel)
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
      
      setSharedUsers(prev => [...prev, user]);
      refetchSharedUsers();
      
      const permissionText = selectedPermissionLevel === 'EDITOR' ? 'Editor' : 'Solo lectura';
      toast.success(`¡Tablero compartido con ${getUserDisplayName(user)} como ${permissionText}!`);
      
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
      toast.success(`Se removió el acceso de ${getUserDisplayName(user)}`);
      
    } catch (error) {
      console.error('❌ Error removiendo acceso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al remover acceso: ${errorMessage}`);
    }
  };

  const handleChangePermission = async (user: User, newLevel: 'EDITOR' | 'VIEWER') => {
    try {
      if (!user.id) {
        toast.error('No se puede cambiar el permiso: ID de usuario no encontrado');
        return;
      }

      const backendLevel = frontendToBackendPermission(newLevel);

      await updatePermissionMutation.mutateAsync({
        boardId,
        userId: user.id,
        newLevel: backendLevel
      });

      const permissionText = newLevel === 'EDITOR' ? 'Editor' : 'Solo lectura';
      toast.success(`¡Permiso de ${getUserDisplayName(user)} cambiado a ${permissionText}!`);
      
      setEditingUserId(null);
      refetchSharedUsers();
      
    } catch (error) {
      console.error('❌ Error cambiando permiso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cambiar permiso: ${errorMessage}`);
    }
  };

  const toggleEditMode = (userId: number) => {
    setEditingUserId(editingUserId === userId ? null : userId);
  };

  // Helper function para determinar si un usuario es el dueño del tablero
  const isOwner = (user: User): boolean => {
    if (user.level && user.level.toUpperCase() === 'OWNER') {
      return true;
    }
    
    if (currentUser && user.id === currentUser.id) {
      return true;
    }
    
    return false;
  };

  return (
    <div>
      {/* Usuarios ya compartidos */}
      {combinedSharedUsers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Usuarios con acceso:</h3>
          <div className="space-y-2">
            {combinedSharedUsers.map((user) => {
              const userIsOwner = isOwner(user);
              
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      userIsOwner ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {getUserInitial(user)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {getUserDisplayName(user)}
                        {userIsOwner && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">👑 Dueño</span>}
                      </p>
                      {(user.firstName || user.lastName) && user.alias && (
                        <p className="text-sm text-gray-500">
                          {user.firstName} {user.lastName}
                        </p>
                      )}
                      {user.level && (
                        <p className="text-xs text-blue-600 font-medium">
                          {getPermissionDisplayText(user.level)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {userIsOwner ? (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">
                        Propietario
                      </span>
                    ) : editingUserId === user.id ? (
                      <div className="flex items-center space-x-2">
                        {updatePermissionMutation.isPending && (
                          <div className="flex items-center space-x-1 mr-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            <span className="text-xs text-gray-500">Actualizando...</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleChangePermission(user, 'EDITOR')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            user.level === 'EDITOR'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                          }`}
                          disabled={updatePermissionMutation.isPending}
                        >
                          ✏️ Editor
                        </button>
                        <button
                          onClick={() => handleChangePermission(user, 'VIEWER')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            user.level === 'VIEWER'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                          }`}
                          disabled={updatePermissionMutation.isPending}
                        >
                          👁️ Solo lectura
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                          disabled={updatePermissionMutation.isPending}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleEditMode(user.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Cambiar
                        </button>
                        <button
                          onClick={() => handleRemoveShare(user)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

      {/* Selector de nivel de permisos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nivel de permisos para nuevos usuarios:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedPermissionLevel('EDITOR')}
            className={`p-3 border rounded-md text-left transition-colors ${
              selectedPermissionLevel === 'EDITOR'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium flex items-center">
              <span className="mr-2">✏️</span> Editor
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Puede ver, crear, editar y eliminar tareas
            </div>
          </button>
          <button
            onClick={() => setSelectedPermissionLevel('VIEWER')}
            className={`p-3 border rounded-md text-left transition-colors ${
              selectedPermissionLevel === 'VIEWER'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-medium flex items-center">
              <span className="mr-2">👁️</span> Solo lectura
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Solo puede ver el tablero y las tareas
            </div>
          </button>
        </div>
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
          💡 Puedes cambiar los permisos de usuarios ya compartidos usando el botón "Cambiar" junto a su nombre.
        </div>
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
                      {getUserInitial(user)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{getUserDisplayName(user)}</p>
                      {(user.firstName || user.lastName) && user.alias && (
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
                      Compartir como {selectedPermissionLevel === 'EDITOR' ? 'Editor' : 'Solo lectura'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
