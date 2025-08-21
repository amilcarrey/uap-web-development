// Reusable settings button component with multiple visual variants
interface SettingsButtonProps {
  onOpenSettings: () => void;
  className?: string;
  variant?: 'icon' | 'button' | 'menu-item';
}

export function SettingsButton({
  onOpenSettings,
  className = '',
  variant = 'icon',
}: SettingsButtonProps) {
  const baseClasses = "transition-colors duration-200";

  const variants = {
    icon: `${baseClasses} p-2 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg`,
    button: `${baseClasses} px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 flex items-center space-x-2`,
    'menu-item': `${baseClasses} flex items-center space-x-3 px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-100 w-full text-left`
  };

  const content = {
    icon: <span className="text-lg">🛠️</span>,
    button: (
      <>
        <span className="text-lg">🛠️</span>
        <span>Configuraciones</span>
      </>
    ),
    'menu-item': (
      <>
        <span className="text-lg">🛠️</span>
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
