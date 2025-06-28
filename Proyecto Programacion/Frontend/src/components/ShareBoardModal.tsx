import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchUsers, useAllUsers, useBoardSharedUsers } from '../hooks/userSettings';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: number;
  alias: string;
  firstName: string;
  lastName: string;
  permissionId?: number; // ID del permiso para poder eliminarlo
  level?: string; // Nivel de permiso
}

interface Props {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareBoardModal({ boardId, isOpen, onClose }: Props) {
  // � LOG CRÍTICO - verificar si llega hasta aquí
  console.log('🎯 ShareBoardModal: INICIO DEL COMPONENTE - isOpen:', isOpen, 'boardId:', boardId);

  if (!isOpen) {
    console.log('🎯 ShareBoardModal: isOpen es false, retornando null');
    return null;
  }

  // 🔥 LOG CRÍTICO - verificar si llega hasta aquí
  console.log('🎯 ShareBoardModal: RENDERIZANDO MODAL - isOpen:', isOpen, 'boardId:', boardId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Compartir Tablero - VERSIÓN SIMPLIFICADA</h2>
        <p className="mb-4">BoardId: {boardId}</p>
        <p className="mb-4 text-green-600">✅ ¡El modal se está renderizando correctamente!</p>
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