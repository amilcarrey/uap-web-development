export interface Props {
  tabId?: string;
  label: string;
  isActive?: boolean;
  isAddButton?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onRemove?: () => void;
}
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
      </button>

      {onRemove && !isAddButton && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1 top-1/2 -translate-y-1/2  text-black rounded-full w-5 h-5 flex items-center justify-center text-xs hover:cursor-pointer"
          title="Eliminar pestaña"
        >
          x
        </button>
      )}
    </span>
  );
}
