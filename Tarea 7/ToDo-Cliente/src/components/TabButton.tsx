//src\components\TabButton.tsx



// Definición de las propiedades que puede recibir el componente TabButton
export interface Props {
  tabId?: string;                           // ID único de la pestaña, opcional
  label: string;                           // Texto que se muestra dentro del botón
  isActive?: boolean;                      // Indica si el botón está activo (seleccionado), por defecto falso
  isAddButton?: boolean;                   // Indica si este botón es el botón especial para agregar pestañas, por defecto falso
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Función que se ejecuta al hacer clic en el botón, opcional
  onRemove?: () => void; // Función que se ejecuta al eliminar la pestaña, opcional
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
  onClick,
  onRemove,
}: Props) {
  return (
    <span className="relative flex items-center">
      <button
        className={`
          tab-button 
          relative flex items-center gap-2 pr-8 pl-5 py-2.5 bg-[#ddd] border-none cursor-pointer text-base text-center transition-colors rounded hover:bg-[#ccc]
          ${isActive ? 'bg-[#909090] text-white' : ''}
          ${isAddButton ? 'add-tab-button' : ''}
        `}
        data-tab={tabId}
        onClick={onClick}
      >
        {label}
        {/* Espacio reservado para que el botón × no se superponga al texto */}
      </button>

      {/* Botón de eliminar */}
      {onRemove && !isAddButton && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 top-1/2 -translate-y-1/2  text-black rounded-full w-5 h-5 flex items-center justify-center text-xs hover:cursor-pointer"
          title="Eliminar pestaña"
          tabIndex={-1}
        >
          x
        </button>
      )}
    </span>
  );
}
