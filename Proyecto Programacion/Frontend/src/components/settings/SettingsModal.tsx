import { BaseModal } from '../ui/BaseModal';
import { UnifiedSettingsPage } from './UnifiedSettingsPage';

// Componente Modal específico para configuraciones
// Este modal contiene la página de configuraciones unificadas, osea las configuraciones de usuario, preferencias y demás ajustes de la aplicación.
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

export { useSettingsModal } from '../../hooks/useSettingsModal';
export { SettingsButton } from '../ui/SettingsButton';
