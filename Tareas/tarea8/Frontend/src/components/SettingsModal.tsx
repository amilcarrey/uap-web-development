import { BaseModal } from './ui/BaseModal';
import { UnifiedSettingsPage } from './UnifiedSettingsPage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SettingsModal
 * A modal component specifically for displaying the unified settings page.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="4xl" // Valid size
    >
      <UnifiedSettingsPage />
    </BaseModal>
  );
}

// Export hooks and components for external use
export { useSettingsModal } from '../hooks/useSettingsModal';
export { SettingsButton } from './ui/SettingsButton';
