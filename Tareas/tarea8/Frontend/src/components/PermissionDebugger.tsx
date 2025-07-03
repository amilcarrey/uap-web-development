// src/components/PermissionDebugger.tsx
import { useState } from 'react';

interface PermissionDebuggerProps {
  boardId: string;
}

export function PermissionDebugger({ boardId }: PermissionDebuggerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const simulateViewerToken = () => {
    // Crear un token de prueba que simula un usuario VIEWER
    const currentPayload = JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '{}'));
    
    const payload = {
      ...currentPayload,
      boardPermissions: [
        {
          boardId: parseInt(boardId),
          permission: "VIEWER"
        }
      ]
    };
    
    const fakeToken = btoa(JSON.stringify(payload));
    localStorage.setItem('token', `header.${fakeToken}.signature`);
    
    console.log('🧪 [PermissionDebugger] Token VIEWER simulado para tablero:', boardId);
    console.log('🧪 [PermissionDebugger] Nuevo payload:', payload);
    
    // Forzar recarga de la página para que se detecten los nuevos permisos
    window.location.reload();
  };

  const simulateEditorToken = () => {
    // Crear un token de prueba que simula un usuario EDITOR
    const currentPayload = JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '{}'));
    
    const payload = {
      ...currentPayload,
      boardPermissions: [
        {
          boardId: parseInt(boardId),
          permission: "EDITOR"
        }
      ]
    };
    
    const fakeToken = btoa(JSON.stringify(payload));
    localStorage.setItem('token', `header.${fakeToken}.signature`);
    
    console.log('🧪 [PermissionDebugger] Token EDITOR simulado para tablero:', boardId);
    console.log('🧪 [PermissionDebugger] Nuevo payload:', payload);
    
    // Forzar recarga de la página para que se detecten los nuevos permisos
    window.location.reload();
  };

  const removePermissions = () => {
    // Quitar permisos específicos del tablero del token
    const currentPayload = JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '{}'));
    
    const payload = {
      ...currentPayload,
      boardPermissions: undefined // Quitar permisos para que asuma OWNER
    };
    
    delete payload.boardPermissions;
    
    const fakeToken = btoa(JSON.stringify(payload));
    localStorage.setItem('token', `header.${fakeToken}.signature`);
    
    console.log('🧪 [PermissionDebugger] Permisos removidos, asumirá OWNER para tablero:', boardId);
    console.log('🧪 [PermissionDebugger] Nuevo payload:', payload);
    
    // Forzar recarga de la página para que se detecten los nuevos permisos
    window.location.reload();
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-lg text-xs shadow-lg z-50"
      >
        🔧 Debug Permisos
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 w-64">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-700">Debug Permisos</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={simulateViewerToken}
          className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200"
        >
          👁️ Simular VIEWER
        </button>
        
        <button
          onClick={simulateEditorToken}
          className="w-full bg-green-100 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-200"
        >
          ✏️ Simular EDITOR
        </button>
        
        <button
          onClick={removePermissions}
          className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
        >
          🔄 Quitar permisos (OWNER)
        </button>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        BoardId: {boardId}
      </div>
    </div>
  );
}
