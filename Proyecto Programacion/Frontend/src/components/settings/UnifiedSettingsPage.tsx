import { UserProfile } from '../user/UserProfile';
import { UserSettings } from '../user/UserSettings';
import { Configuracion } from './Configuracion';
import { useSettingsNavigation, useSettingsKeyboardShortcuts } from '../../hooks/useSettingsNavigation';

// Tipos para las tabs de configuración
interface ConfigTab {
  id: string;
  label: string;
  icon: string;
  description: string;
  component: React.ComponentType;
  badge?: string;
}

export function UnifiedSettingsPage() {
  // Usar el hook personalizado para navegación
  const { activeTab, navigateToTab } = useSettingsNavigation();

  // Definir las tabs de configuración disponibles
  const configTabs: ConfigTab[] = [
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: '👤',
      description: 'Información personal y datos de contacto',
      component: UserProfile
    },
    {
      id: 'preferences',
      label: 'Preferencias',
      icon: '⚙️',
      description: 'Configuraciones personales (elementos por página, alias)',
      component: UserSettings
    },
    {
      id: 'application',
      label: 'Aplicación',
      icon: '🔧',
      description: 'Configuraciones globales (intervalos, comportamiento)',
      component: Configuracion
    }
  ];

  const activeTabData = configTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  // Configurar atajos de teclado
  useSettingsKeyboardShortcuts(configTabs, navigateToTab);

  const handleTabChange = (tabId: string) => {
    navigateToTab(tabId);
    // Opcional: mostrar un toast suave para confirmar el cambio
    // const tabName = configTabs.find(tab => tab.id === tabId)?.label;
    // toast.success(`Navegando a ${tabName}`, { duration: 1000 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuraciones</h1>
              <p className="mt-1 text-gray-600">
                Gestiona tu perfil, preferencias y configuraciones de la aplicación
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {configTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    group relative flex items-center space-x-3 py-4 px-2 border-b-2 font-medium text-sm
                    transition-all duration-200 ease-in-out
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-white rounded-t-lg -mb-px'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-lg transition-transform group-hover:scale-110">
                    {tab.icon}
                  </span>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-normal mt-0.5 hidden sm:block">
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
            <span>💡</span>
            <span><strong>Tip:</strong> Los cambios se guardan automáticamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
