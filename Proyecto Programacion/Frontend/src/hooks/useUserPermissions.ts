// src/hooks/useUserPermissions.ts
import { useState, useEffect } from 'react';
import { useTabs } from './tabs'; // Importar hook de tabs

interface UserPermission {
  isViewer: boolean;
  isEditor: boolean;
  isOwner: boolean;
  permissionLevel: 'OWNER' | 'EDITOR' | 'VIEWER' | null;
}

/**
 * Hook para detectar los permisos del usuario actual en un tablero específico
 */
export function useUserPermissions(boardId: string): UserPermission {
  const [permissions, setPermissions] = useState<UserPermission>({
    isViewer: false,
    isEditor: false,
    isOwner: false,
    permissionLevel: null
  });

  // Obtener datos de tabs que ya incluyen userRole del backend
  const { data: tabs } = useTabs();

  useEffect(() => {
    const detectPermissions = async () => {
      const token = localStorage.getItem('token');
      console.log('🔐 [useUserPermissions] Detectando permisos para tablero:', boardId);
      console.log('🔐 [useUserPermissions] Token presente:', !!token);
      console.log('🔐 [useUserPermissions] Tabs disponibles:', tabs);
      
      if (!token || !boardId) {
        console.log('🔐 [useUserPermissions] Sin token o boardId, estableciendo permisos vacíos');
        setPermissions({
          isViewer: false,
          isEditor: false,
          isOwner: false,
          permissionLevel: null
        });
        return;
      }

      // PRIMERA OPCIÓN: Buscar en los datos de tabs (más eficiente)
      if (tabs && tabs.length > 0) {
        const currentTab = tabs.find(tab => tab.id === boardId);
        if (currentTab && currentTab.userRole) {
          const level = currentTab.userRole.toUpperCase();
          console.log('🔐 [useUserPermissions] Permiso encontrado en tabs:', level);
          
          const newPermissions = {
            isViewer: level === 'VIEWER',
            isEditor: level === 'EDITOR',
            isOwner: level === 'OWNER',
            permissionLevel: level as 'OWNER' | 'EDITOR' | 'VIEWER'
          };
          
          console.log('🔐 [useUserPermissions] Estableciendo permisos desde tabs:', newPermissions);
          setPermissions(newPermissions);
          return; // Salir temprano si encontramos en tabs
        }
      }

      // SEGUNDA OPCIÓN: Buscar en el token (fallback)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔐 [useUserPermissions] Payload completo del token:', payload);
        console.log('🔐 [useUserPermissions] Board permissions en token:', payload.boardPermissions);
        
        // Buscar permisos específicos del tablero en el token
        const boardPermission = payload.boardPermissions?.find(
          (perm: any) => {
            const permBoardId = String(perm.boardId);
            const targetBoardId = String(boardId);
            console.log(`🔐 [useUserPermissions] Comparando permiso boardId: ${permBoardId} con target: ${targetBoardId}`);
            return permBoardId === targetBoardId;
          }
        );

        console.log('🔐 [useUserPermissions] Permiso encontrado en token:', boardPermission);

        if (boardPermission) {
          const level = boardPermission.permission?.toUpperCase();
          console.log('🔐 [useUserPermissions] Nivel de permiso detectado desde token:', level);
          
          const newPermissions = {
            isViewer: level === 'VIEWER',
            isEditor: level === 'EDITOR',
            isOwner: level === 'OWNER',
            permissionLevel: level as 'OWNER' | 'EDITOR' | 'VIEWER'
          };
          
          console.log('🔐 [useUserPermissions] Estableciendo permisos desde token:', newPermissions);
          setPermissions(newPermissions);
        } else {
          // TERCERA OPCIÓN: Consultar backend (último recurso)
          console.log('🔐 [useUserPermissions] No hay permisos en token, consultando backend...');
          
          try {
            const response = await fetch(`http://localhost:3000/api/boards/${boardId}/permissions/me`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              credentials: 'include'
            });

            if (response.ok) {
              const permissionData = await response.json();
              console.log('🔐 [useUserPermissions] Respuesta del backend:', permissionData);
              
              const level = permissionData.permission?.toUpperCase();
              console.log('🔐 [useUserPermissions] Nivel de permiso desde backend:', level);
              
              if (level) {
                const newPermissions = {
                  isViewer: level === 'VIEWER',
                  isEditor: level === 'EDITOR',
                  isOwner: level === 'OWNER',
                  permissionLevel: level as 'OWNER' | 'EDITOR' | 'VIEWER'
                };
                
                console.log('🔐 [useUserPermissions] Estableciendo permisos desde backend:', newPermissions);
                setPermissions(newPermissions);
              } else {
                // Asumir que es owner (tablero propio)
                console.log('🔐 [useUserPermissions] Sin permisos específicos, asumiendo OWNER (tablero propio)');
                setPermissions({
                  isViewer: false,
                  isEditor: true,
                  isOwner: true,
                  permissionLevel: 'OWNER'
                });
              }
            } else {
              console.log('🔐 [useUserPermissions] Error en respuesta del backend:', response.status);
              // Asumir que es owner si no se pueden obtener permisos
              setPermissions({
                isViewer: false,
                isEditor: true,
                isOwner: true,
                permissionLevel: 'OWNER'
              });
            }
          } catch (fetchError) {
            console.error('🔐 [useUserPermissions] Error consultando backend:', fetchError);
            // Asumir que es owner si hay error
            setPermissions({
              isViewer: false,
              isEditor: true,
              isOwner: true,
              permissionLevel: 'OWNER'
            });
          }
        }
      } catch (error) {
        console.error('🔐 [useUserPermissions] Error decodificando token para permisos:', error);
        setPermissions({
          isViewer: false,
          isEditor: false,
          isOwner: false,
          permissionLevel: null
        });
      }
    };

    detectPermissions();
  }, [boardId, tabs]); // Agregar tabs como dependencia

  return permissions;
}

/**
 * Hook simplificado para solo detectar si es VIEWER
 */
export function useIsViewer(boardId: string): boolean {
  const { isViewer } = useUserPermissions(boardId);
  return isViewer;
}
