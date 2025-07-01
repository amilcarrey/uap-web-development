import { BaseModal } from './ui/BaseModal';
import { ShareBoardContent } from './ShareBoardContent';

interface Props {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareBoardModalComplete({ boardId, isOpen, onClose }: Props) {
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
          <h2 className="text-xl font-semibold text-gray-800">Compartir Tablero</h2>
          <p className="text-sm text-gray-500 mt-1">
            Comparte este tablero con otros usuarios y gestiona sus permisos
          </p>
        </div>
        
        {/* Content */}
        <ShareBoardContent boardId={boardId} />
      </div>
    </BaseModal>
  );
}
