import { BaseModal } from '../ui/BaseModal';
import { UnifiedSettingsPage } from './UnifiedSettingsPage';

// Componente Modal específico para configuraciones
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="6xl"
    >
      <UnifiedSettingsPage />
    </BaseModal>
  );
}

// Re-export para mantener compatibilidad
export { useSettingsModal } from '../../hooks/useSettingsModal';
export { SettingsButton } from '../ui/SettingsButton';
