//src\components\TabButton.tsx



// Definición de las propiedades que puede recibir el componente TabButton
export interface Props {
  tabId?: string;                           // ID único de la pestaña, opcional
  label: string;                           // Texto que se muestra dentro del botón
  isActive?: boolean;                      // Indica si el botón está activo (seleccionado), por defecto falso
  isAddButton?: boolean;                   // Indica si este botón es el botón especial para agregar pestañas, por defecto falso
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Función que se ejecuta al hacer clic en el botón, opcional
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
}: Props) {
  return (
    <button
      className={`
        tab-button 
        flex-1 px-5 py-2.5 bg-[#ddd] border-none cursor-pointer text-base text-center transition-colors rounded hover:bg-[#ccc]
        ${isActive ? 'bg-[#909090] text-white' : ''}       // Si está activo, cambia el fondo y el color del texto
        ${isAddButton ? 'add-tab-button' : ''}            // Si es botón de agregar, aplica clase especial
      `}
      data-tab={tabId}            // Atributo personalizado con el ID de la pestaña (útil para identificadores en eventos)
      onClick={onClick}           // Manejador del evento click, si fue pasado como prop
    >
      {label}                    {/* Texto visible dentro del botón */}
    </button>
  );
}
