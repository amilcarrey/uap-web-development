// Botón de configuraciones que se puede usar en cualquier lugar
interface SettingsButtonProps {
  onOpenSettings: () => void;
  className?: string;
  variant?: 'icon' | 'button' | 'menu-item';
}

export function SettingsButton({ onOpenSettings, className = '', variant = 'icon' }: SettingsButtonProps) {
  const baseClasses = "transition-colors duration-200";
  
  const variants = {
    icon: `${baseClasses} p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg`,
    button: `${baseClasses} px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2`,
    'menu-item': `${baseClasses} flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left`
  };

  const content = {
    icon: <span className="text-lg">⚙️</span>,
    button: (
      <>
        <span className="text-lg">⚙️</span>
        <span>Configuraciones</span>
      </>
    ),
    'menu-item': (
      <>
        <span className="text-lg">⚙️</span>
        <span>Configuraciones</span>
      </>
    )
  };

  return (
    <button
      onClick={onOpenSettings}
      className={`${variants[variant]} ${className}`}
      title="Abrir configuraciones"
    >
      {content[variant]}
    </button>
  );
}
