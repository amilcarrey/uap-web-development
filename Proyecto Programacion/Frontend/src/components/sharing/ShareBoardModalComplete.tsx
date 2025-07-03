import { BaseModal } from '../ui/BaseModal';
import { ShareBoardContent } from './ShareBoardContent';

interface Props {
  boardId: string;
  boardTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

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
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Compartir Tablero
            {boardTitle && (
              <span className="text-blue-600 ml-2">"{boardTitle}"</span>
            )}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Comparte este tablero con otros usuarios y gestiona sus permisos
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{boardId}</span>
          </p>
        </div>
        
        {/* Content - Key específica por tablero para forzar re-mount y aislamiento */}
        <ShareBoardContent key={boardId} boardId={boardId} />
      </div>
    </BaseModal>
  );
}
