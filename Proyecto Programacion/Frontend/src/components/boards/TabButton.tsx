//src\components\TabButton.tsx
import { canShareBoard } from '../../utils/permissions';
import type { UserRole } from '../../types/permissions';

// Definición de las propiedades que puede recibir el componente TabButton
export interface Props {
  tabId?: string;                           // ID único de la pestaña, opcional
  label: string;                           // Texto que se muestra dentro del botón
  isActive?: boolean;                      // Indica si el botón está activo (seleccionado), por defecto falso
  isAddButton?: boolean;                   // Indica si este botón es el botón especial para agregar pestañas, por defecto falso
  userRole?: UserRole; // Agregar rol del usuario
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Función que se ejecuta al hacer clic en el botón, opcional
  onRemove?: () => void; // Función que se ejecuta al eliminar la pestaña, opcional
  onShare?: () => void; // Agregar callback para compartir
}

/**
 * Componente TabButton
 * Representa un botón individual en la barra de pestañas.
 * Puede funcionar como un botón normal de selección o como un botón especial para agregar nuevas pestañas.
 * Aplica estilos diferentes según si está activo o si es el botón de agregar.
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
          relative flex items-center gap-2 pr-16 pl-5 py-2.5 bg-[#ddd] border-none cursor-pointer text-base text-center transition-colors rounded hover:bg-[#ccc]
          ${isActive ? 'bg-[#909090] text-white' : ''}
          ${isAddButton ? 'add-tab-button' : ''}
        `}
        data-tab={tabId}
        onClick={onClick}
      >
        {label}
      </button>

      {/* Botones de acción */}
      {!isAddButton && (
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Botón compartir (solo para owners) */}
          {onShare && userRole && canShareBoard(userRole) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="w-5 h-5 flex items-center justify-center text-xs hover:cursor-pointer hover:bg-blue-100 rounded"
              title="Compartir tablero"
              tabIndex={-1}
            >
              👥
            </button>
          )}

          {/* Botón de eliminar */}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="w-5 h-5 flex items-center justify-center text-xs hover:cursor-pointer hover:bg-red-100 rounded"
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
