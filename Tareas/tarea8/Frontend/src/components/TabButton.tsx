import { canShareBoard } from '../utils/permissions';
import type { UserRole } from '../types/permissions';

export interface Props {
  tabId?: string;
  label: string;
  isActive?: boolean;
  isAddButton?: boolean;
  userRole?: UserRole;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onRemove?: () => void;
  onShare?: () => void;
}

/**
 * Componente TabButton
 * Representa un botón individual en la barra de pestañas.
 * Puede ser un botón normal, un botón activo o un botón especial para agregar nuevas pestañas.
 * También puede incluir acciones como eliminar o compartir.
 */
export function TabButton({
  tabId,
  label,
  isActive = false,
  isAddButton = false,
  userRole,
  onClick,
  onRemove,
  onShare,
}: Props) {
  return (
    <span className="relative flex items-center">
      <button
        className={`
          tab-button 
          relative flex items-center gap-2 pr-16 pl-5 py-2.5 bg-gray-300 border-none cursor-pointer text-base text-center transition-colors rounded hover:bg-gray-400
          ${isActive ? 'bg-gray-600 text-white' : ''}
          ${isAddButton ? 'add-tab-button font-bold text-lg' : ''}
        `}
        data-tab={tabId}
        onClick={onClick}
      >
        {label}
      </button>

      {/* Acciones adicionales (compartir / eliminar) */}
      {!isAddButton && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Botón para compartir (solo si el usuario tiene permisos) */}
          {onShare && userRole && canShareBoard(userRole) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="w-5 h-5 flex items-center justify-center text-xs hover:bg-blue-100 rounded"
              title="Compartir pestaña"
              tabIndex={-1}
            >
              Share
            </button>
          )}

          {/* Botón para eliminar la pestaña */}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-5 h-5 flex items-center justify-center text-xs hover:bg-red-100 rounded"
              title="Eliminar pestaña"
              tabIndex={-1}
            >
              ×
            </button>
          )}
        </div>
      )}
    </span>
  );
}
