import { useEffect, useState } from 'react';

interface EmptyTasksMessageProps {
  boardId: string;
  isLoading: boolean;
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  boardPermissions?: Array<{
    boardId: string;
    permission: string;
  }>;
  invitations?: Array<any>;
}

export function EmptyTasksMessage({ boardId, isLoading }: EmptyTasksMessageProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isViewer, setIsViewer] = useState(false);

  useEffect(() => {
    // Analizar token para obtener información del usuario
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(payload);
        
        // Verificar si es un usuario VIEWER para este tablero
        const boardPermission = payload.boardPermissions?.find(
          (perm: any) => perm.boardId === boardId
        );
        
        if (boardPermission?.permission === 'VIEWER') {
          setIsViewer(true);
        }
      } catch (e) {
        // Error al analizar token - ignorar silenciosamente
      }
    }
  }, [boardId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Cargando tareas...</div>
      </div>
    );
  }

  if (isViewer) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mx-4 my-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              No se encontraron tareas
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Tienes permisos de <strong>visualización</strong> en este tablero, pero no se encontraron tareas.
              </p>
              <div className="mt-3 space-y-1">
                <p><strong>Posibles causas:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>El tablero aún no tiene tareas creadas</li>
                  <li>Hay un problema de permisos en el backend</li>
                  <li>El propietario del tablero necesita verificar la configuración</li>
                </ul>
              </div>
              <div className="mt-3 text-xs bg-yellow-100 p-2 rounded">
                <p><strong>Información de debugging:</strong></p>
                <p>Usuario: {userInfo?.username || userInfo?.email}</p>
                <p>ID del tablero: {boardId}</p>
                <p>Tipo de acceso: VIEWER</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mensaje genérico para otros usuarios
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📝</div>
      <div className="text-gray-500 text-lg font-medium mb-2">No hay tareas aún</div>
      <div className="text-gray-400 text-sm">
        Agrega tu primera tarea para comenzar
      </div>
    </div>
  );
}
