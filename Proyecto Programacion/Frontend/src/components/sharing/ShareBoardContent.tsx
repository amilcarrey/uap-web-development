import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchUsers, useAllUsers, useBoardSharedUsers, useUpdateBoardPermission } from '../../hooks/userSettings';
import { useAuthStore } from '../../stores/authStore';
import { getPermissionDisplayText, frontendToBackendPermission } from '../../types/permissions';

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

  // Query client para invalidar cache
  const queryClient = useQueryClient();

  /**
   * INVALIDACIÓN DE CACHE
   * 
   * Cada vez que la aplicación hace peticiones al servidor (como obtener usuarios compartidos),
   * React Query guarda esas respuestas en cache para evitar hacer la misma petición repetidamente.
   * 
   * El problema aparece cuando se quiere cambiar algo en el servidor (compartir tablero, cambiar permisos, etc.),
   * el cache sigue teniendo los datos antiguos, entonces la interfaz no se actualiza a pesar de que los cambios se
   * realizon de forma correcta. --El problema era que no se reflejaban esos cambios--.
   * 
   * Para soluciónar ese problema se uso la invalidación de caache 
   * ---"Invalidar" el cache = decirle a React Query: "estos datos ya no son válidos, la próxima vez que los necesites, ve al servidor a buscar datos frescos".---
   * 
   * Lo que ocurria cuando no tenia invalidación:
   * 1. Sin invalidación:
   *    - El usuaio Daniel2102 compartia un tablero con Agustin2102 ✅
   *    - Pero Agustin2102 NO aparecia en la lista ❌ (Eso era porque se utilizaban para renderizar el componente datos viejos que estaban en la cache)
   *    - Por lo que se necesitaba recargar el componente para que apareciera Agustin2102 
   *      (Esto ocuarria tanto cuando se compartia un tablero como cuando se cambiaba el nivel de permiso de un usuario)

   * 2. Con invalidación:
   *    - El usuario Daniel2102 comparte un tablero con Agustin2102 ✅
   *    - Cache se invalida automáticamente y React Query va al servidor por datos frescos
   *    - Agustin2102 aparece inmediatamente entre los usuarios con quienes se compartio el tablero ✅
   *      (Lo mismo pasa con los niveles de permisos)
   */
  const invalidateAllPermissionCaches = async () => {
    
    // 1️⃣ CACHE ESPECÍFICO DEL TABLERO ACTUAL
    // Invalida la lista de usuarios compartidos SOLO de este tablero
    // Esto actualiza la sección "Usuarios con acceso" del modal
    await queryClient.invalidateQueries({
      queryKey: ['board-shared-users', boardId] // boardId asegura que solo afecte este tablero
    });
    
    // 2️⃣ CACHE GLOBAL DE TABLEROS
    // Invalida la lista completa de tableros del usuario
    // Esto es necesario porque cuando compartimos un tablero, puede cambiar
    // información en la lista principal de tableros (ej: indicadores de "compartido")
    await queryClient.invalidateQueries({
      queryKey: ['tabs'] // Afecta todos los tableros del usuario
    });
    
    // 3️⃣ CACHE GENERAL DE USUARIOS
    // Invalida la lista de todos los usuarios disponibles
    // Útil para asegurar que los datos de usuarios estén frescos
    // (nombres, alias, etc. podrían haber cambiado)
    await queryClient.invalidateQueries({
      queryKey: ['users'] // Lista completa de usuarios del sistema
    });
    
  };

  //function para obtener inicial de usuario (Se utiliza para el buscador de usuarios)
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

  //function para obtener el nombre completo del usuario
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
  //Es para evitar que el propio dueño pueda compartir el tablero con sigo mismo
  const currentUser = useAuthStore((state) => state.user);

  // Hooks para obtener datos
  const { // Hook para obtener todos los usuarios del sistema
    data: allUsers = [], 
    isLoading: allUsersLoading
  } = useAllUsers();
  
  const {   // Hook para buscar usuarios por término
    data: searchResults = [], 
    isLoading: searchLoading
  } = useSearchUsers(searchTerm);
  
  const {  // Hook para obtener usuarios compartidos del backend
    data: alreadySharedUsers = [], 
    refetch: refetchSharedUsers 
  } = useBoardSharedUsers(boardId);

  // Hook para actualizar permisos
  const updatePermissionMutation = useUpdateBoardPermission();

  // Combinar usuarios ya compartidos desde el backend con los locales
  // Priorizar siempre los datos del backend sobre el estado local
  const combinedSharedUsers = useMemo(() => {
    // Usar principalmente los datos del backend, que son la fuente de verdad
    const backendUserIds = alreadySharedUsers.map(u => u.id);
    
    // Solo agregar usuarios del estado local que NO estén en el backend
    // (esto puede pasar cuando acabamos de agregar un usuario pero el refetch aún no se completó)
    const localOnlyUsers = sharedUsers.filter(u => u && u.id && !backendUserIds.includes(u.id));
    
    const combined = [...alreadySharedUsers, ...localOnlyUsers];

    return combined; // Retornar la lista combinada de usuarios compartidos
  }, [sharedUsers, alreadySharedUsers, boardId]); // Agregar boardId como dependencia

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




  /**
   * 🔄 AISLAMIENTO DE DATOS POR TABLERO
   * 
   * ¿POR QUÉ el useEffect?
   * Este componente se reutiliza para diferentes tableros. Sin este reset,
   * cuando cambias de tablero, los datos del tablero anterior quedan "pegados"
   * en la interfaz, causando confusión y datos incorrectos.
   * (Osea cada tablero puede ser compartido con diferentes usuarios y cuando se hacia un cambio entre los tableros
   * la informacion que le pertenecia a un tablero tambiene staba en el otro)
   * 
   * PROBLEMA SIN ESTE useEffect:
   * 1. Abres modal para compartir "Tablero A"
   * 2. Buscas "Agustin2102" y seleccionas "Solo lectura"
   * 3. Cierras el modal
   * 4. Abres modal para compartir "Tablero B" 
   * 5. ❌ PROBLEMA: Sigue mostrando "Agustin2102" en la búsqueda y "Solo lectura" seleccionado
   * 6. ❌ MÁS GRAVE: Los usuarios compartidos del "Tablero A" aparecen en "Tablero B"
   * 
   * SOLUCIÓN CON ESTE useEffect:
   * Cada vez que cambia boardId (cuando abres el modal para otro tablero),
   * se resetean TODOS los estados locales del componente para empezar limpio.
   */
  useEffect(() => {
    // Limpiar usuarios compartidos del estado local
    // Evita que aparezcan usuarios del tablero anterior
    setSharedUsers([]);
    
    // Limpiar término de búsqueda
    // Evita que aparezca el texto de búsqueda del tablero anterior
    setSearchTerm('');
    
    // Resetear nivel de permisos a valor por defecto
    // Evita que quede seleccionado el nivel del tablero anterior
    setSelectedPermissionLevel('EDITOR');
    
    // Cancelar cualquier edición en progreso
    // Evita que quede abierto el modo de edición de permisos
    setEditingUserId(null);
  }, [boardId]); // Se ejecuta cada vez que cambia el ID del tablero

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

      const response = await fetch(`http://localhost:3000/api/boards/${boardId}/permissions`, {
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

      await response.json();
      

      /*
        Lo siguiente es hizo para que los cambios que se realizan en el modal se reflejen automaticamaente en la interfaz
      */
      
      // ACTUALIZACIÓN OPTIMISTA: Agregar al estado local temporalmente
      // Esto hace que el usuario aparezca inmediatamente en la interfaz
      // mientras esperamos que el servidor confirme y el cache se actualice
      setSharedUsers(prev => [...prev, user]);
      
      // SINCRONIZACIÓN: Invalidar caches para obtener datos frescos del servidor
      // Esto asegura que la interfaz muestre los datos más recientes después del cambio
      await invalidateAllPermissionCaches();
      
      // REFETCH MANUAL: Forzar actualización adicional por seguridad
      // En caso de que la invalidación no sea suficiente, forzamos una recarga
      await refetchSharedUsers();
      
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
      
      // El backend espera userId, no permissionId
      const endpoint = `http://localhost:3000/api/boards/${boardId}/permissions/${user.id}`;

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

      // ACTUALIZACIÓN OPTIMISTA: Eliminar del estado local primero
      // Esto hace que el usuario desaparezca inmediatamente de la interfaz
      setSharedUsers(prev => {
        const newUsers = prev.filter(u => u.id !== user.id);
        console.log('🗑️ Estado local actualizado:', newUsers);
        return newUsers;
      });
      
      // SINCRONIZACIÓN: Invalidar TODOS los caches relacionados con permisos
      // Esto asegura que el cambio se refleje en toda la aplicación
      await invalidateAllPermissionCaches();
      
      // REFETCH CON DELAY: Forzar actualización adicional
      // El delay asegura que el servidor haya procesado completamente la eliminación
      setTimeout(async () => {
        await refetchSharedUsers();
      }, 100);
      
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
      
      // SINCRONIZACIÓN: Invalidar caches después de cambiar permisos
      // Los permisos cambiados pueden afectar múltiples partes de la app
      await invalidateAllPermissionCaches();
      
      // REFETCH: Asegurar que los datos estén completamente actualizados
      await refetchSharedUsers();
      
    } catch (error) {
      console.error('❌ Error cambiando permiso:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al cambiar permiso: ${errorMessage}`);
    }
  };

  const toggleEditMode = (userId: number) => {
    setEditingUserId(editingUserId === userId ? null : userId);
  };

  //function para determinar si un usuario es el dueño del tablero
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

/**
 * 📚 PATRÓN DE SINCRONIZACIÓN DE DATOS
 * 
 * Este componente implementa un patrón común en aplicaciones React con servidor:
 * 
 * 1️⃣ OPTIMISTIC UPDATES (Actualizaciones Optimistas):
 *    - Actualizar la interfaz inmediatamente (antes de confirmar con el servidor)
 *    - Mejora la experiencia del usuario (no hay esperas)
 *    - Ejemplo: setSharedUsers(prev => [...prev, user])
 * 
 * 2️⃣ SERVER SYNCHRONIZATION (Sincronización con Servidor):
 *    - Enviar la petición al servidor
 *    - Manejar errores y revertir cambios si es necesario
 * 
 * 3️⃣ CACHE INVALIDATION (Invalidación de Cache):
 *    - Invalidar caches relacionados para forzar datos frescos
 *    - Asegurar que toda la app tenga datos consistentes
 *    - Ejemplo: invalidateAllPermissionCaches()
 * 
 * 4️⃣ BACKUP REFETCH (Refetch de Respaldo):
 *    - Refetch manual adicional por seguridad
 *    - Útil en casos donde la invalidación podría fallar
 *    - Ejemplo: await refetchSharedUsers()
 * 
 * Este patrón asegura que la interfaz sea rápida y responsive, pero también
 * que los datos sean precisos y estén sincronizados con el servidor.
 */
