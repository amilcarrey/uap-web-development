// src/hooks/useShareModal.ts
import { useUIStore } from "../stores/uiStore";

/**
 * Hook personalizado para gestionar el modal de compartir tableros
 * Encapsula toda la lógica relacionada con mostrar/ocultar el modal de compartir
 */
export function useShareModal() {
  const isShareModalOpen = useUIStore(state => state.isShareModalOpen);
  const shareModalBoardId = useUIStore(state => state.shareModalBoardId);
  const setShareModalOpen = useUIStore(state => state.setShareModalOpen);
  const setShareModalBoardId = useUIStore(state => state.setShareModalBoardId);

  /**
   * Abre el modal de compartir para un tablero específico
   */
  const openShareModal = (boardId: string) => {
    setShareModalBoardId(boardId);
    setShareModalOpen(true);
  };

  /**
   * Cierra el modal de compartir
   */
  const closeShareModal = () => {
    setShareModalOpen(false);
    setShareModalBoardId(null);
  };

  return {
    isShareModalOpen,
    shareModalBoardId,
    openShareModal,
    closeShareModal
  };
}
