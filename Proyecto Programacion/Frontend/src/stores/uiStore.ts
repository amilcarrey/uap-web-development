/**
 * 🎨 UI STORE - GESTIÓN DE ESTADO DE LA INTERFAZ
 * 
 * Este store maneja el estado de la interfaz de usuario (UI) que necesita
 * ser compartido entre múltiples componentes de la aplicación.
 * 
 * ¿POR QUÉ USAR UN STORE SEPARADO PARA UI?
 * - Los datos de UI son temporales (qué modal está abierto, qué tarea se está editando)
 * - Se necesita acceso desde múltiples componentes sin pasar props
 * - Evita "prop drilling" (pasar props a través de muchos niveles)
 * - Centraliza la lógica de estado de la interfaz
 * 
 * DIFERENCIA CON OTROS STORES:
 * - authStore: Datos del usuario logueado (persistentes)
 * - configStore: Configuración de la app (persistentes)
 * - uiStore: Estado temporal de la interfaz (NO persistente)
 */

// src/stores/uiStore.ts
import { create } from 'zustand';

/**
 * 📋 DEFINICIÓN DEL ESTADO DE UI
 * 
 * Contiene todos los estados temporales de la interfaz que necesitan
 * ser compartidos entre componentes.
 */
type UIState = {
  // 🎯 EDICIÓN DE TAREAS
  editingTaskId: string | null;          // ID de la tarea que se está editando (null = ninguna)
  setEditingTaskId: (id: string | null) => void;  // Función para cambiar qué tarea se edita
  
  // 🔍 FILTRADO DE TAREAS  
  taskFilter: string;                    // Filtro actual ('all', 'completed', 'pending', etc.)
  setTaskFilter: (filter: string) => void;        // Función para cambiar el filtro
  
  // 🔗 MODAL DE COMPARTIR TABLERO
  isShareModalOpen: boolean;             // ¿Está abierto el modal de compartir?
  setShareModalOpen: (open: boolean) => void;     // Abrir/cerrar modal de compartir
  shareModalBoardId: string | null;      // ID del tablero que se está compartiendo
  setShareModalBoardId: (boardId: string | null) => void;  // Cambiar tablero a compartir
};


export const useUIStore = create<UIState>((set) => ({
  // 🎯 Estados de edición de tareas
  editingTaskId: null,                   // Por defecto no hay tarea en edición
  setEditingTaskId: (id) => set({ editingTaskId: id }),
  
  // 🔍 Estados de filtrado
  taskFilter: 'all',                     // Por defecto mostrar todas las tareas
  setTaskFilter: (filter) => set({ taskFilter: filter }),
  
  // 🔗 Estados del modal de compartir
  isShareModalOpen: false,               // Por defecto modal cerrado
  setShareModalOpen: (open) => set({ isShareModalOpen: open }),
  shareModalBoardId: null,               // Por defecto no hay tablero seleccionado
  setShareModalBoardId: (boardId) => set({ shareModalBoardId: boardId }),
}));

