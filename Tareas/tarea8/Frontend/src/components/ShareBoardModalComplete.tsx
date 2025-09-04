import { BaseModal } from './ui/BaseModal';
import { ShareBoardContent } from './ShareBoardContent';

interface Props {
  boardId: string;
  boardTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ShareBoardModalComplete
 * Modal que permite compartir un tablero con otros usuarios.
 * Muestra el título del tablero y su ID, y renderiza el contenido de compartir.
 */
export function ShareBoardModalComplete({ boardId, boardTitle, isOpen, onClose }: Props) {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="2xl"
      showCloseButton={true}
      closeOnBackdropClick={true}
    >
      <div className="p-6">
        {/* Encabezado del modal */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Compartir Tablero
            {boardTitle && (
              <span className="text-blue-600 ml-2">"{boardTitle}"</span>
            )}
          </h2>
        </div>

        {/* Contenido del modal */}
        <ShareBoardContent key={boardId} boardId={boardId} />
      </div>
    </BaseModal>
  );
}
