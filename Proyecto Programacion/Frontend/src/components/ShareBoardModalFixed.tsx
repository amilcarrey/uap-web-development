import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useAllUsers } from '../hooks/userSettings'; // Agregar este hook para probarlo

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

export function ShareBoardModalFixed({ boardId, isOpen, onClose }: Props) {
  // 🔥 LOG CRÍTICO - verificar si llega hasta aquí
  console.log('🎯 ShareBoardModalFixed: INICIO DEL COMPONENTE - isOpen:', isOpen, 'boardId:', boardId);

  // Obtener usuario actual para depuración
  const currentUser = useAuthStore((state) => state.user);
  
  // 🔥 PROBAR useAllUsers para ver si causa el problema
  const { data: allUsers = [], isLoading: allUsersLoading, error: allUsersError } = useAllUsers();
  
  // Log del usuario actual y usuarios disponibles
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 Usuario actual:', currentUser);
      console.log('🔍 useAllUsers - datos:', { 
        usuarios: allUsers.length, 
        cargando: allUsersLoading, 
        error: allUsersError?.message 
      });
      if (allUsers.length > 0) {
        console.log('🔍 Primeros 3 usuarios:', allUsers.slice(0, 3));
      }
    }
  }, [isOpen, currentUser, allUsers, allUsersLoading, allUsersError]);

  if (!isOpen) {
    console.log('🎯 ShareBoardModalFixed: isOpen es false, retornando null');
    return null;
  }

  // 🔥 LOG CRÍTICO - verificar si llega hasta aquí
  console.log('🎯 ShareBoardModalFixed: RENDERIZANDO MODAL CON USUARIO ACTUAL');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Compartir Tablero (Versión Depurada)</h2>
        <p className="mb-4">BoardId: {boardId}</p>
        
        {currentUser && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm"><strong>Usuario actual:</strong> {currentUser.alias}</p>
            <p className="text-xs text-gray-600">ID: {currentUser.id}</p>
          </div>
        )}
        
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <p className="text-sm font-medium mb-2">Estado de useAllUsers:</p>
          <p className="text-xs">Cargando: {allUsersLoading ? 'SÍ' : 'NO'}</p>
          <p className="text-xs">Usuarios encontrados: {allUsers.length}</p>
          <p className="text-xs">Error: {allUsersError ? allUsersError.message : 'Ninguno'}</p>
        </div>
        
        {!allUsersLoading && allUsers.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm font-medium mb-2">Usuarios disponibles:</p>
            <div className="space-y-1">
              {allUsers.slice(0, 5).map((user) => (
                <p key={user.id} className="text-xs">
                  {user.alias} (ID: {user.id}) - {user.firstName} {user.lastName}
                </p>
              ))}
              {allUsers.length > 5 && (
                <p className="text-xs text-gray-500">... y {allUsers.length - 5} más</p>
              )}
            </div>
          </div>
        )}
        
        <p className="mb-4 text-green-600">✅ Modal funcionando con useAuthStore y useAllUsers</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
