import { UserProfile } from './UserProfile';
import { UserSettings } from './UserSettings';
import { Configuracion } from './Configuracion';
import { useSettingsNavigation, useSettingsKeyboardShortcuts } from '../hooks/useSettingsNavigation';

// 📌 Tipo para cada pestaña de configuración
interface ConfigTab {
  id: string;
  label: string;
  icon: string;
  description: string;
  component: React.ComponentType;
  badge?: string;
}

export function UnifiedSettingsPage() {
  // 🧭 Hook de navegación entre pestañas
  const { activeTab, navigateToTab } = useSettingsNavigation();

  // 🗂️ Definición de pestañas disponibles
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
      icon: '🧩',
      description: 'Configuraciones globales (intervalos, comportamiento)',
      component: Configuracion
    }
  ];

  const activeTabData = configTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  // ⌨️ Atajos de teclado para cambiar pestañas
  useSettingsKeyboardShortcuts(configTabs, navigateToTab);

  const handleTabChange = (tabId: string) => {
    navigateToTab(tabId);
    // toast.success(`Navegando a ${tabName}`, { duration: 1000 });
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🧱 Encabezado */}
        <div className="mb-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 rounded-xl shadow-sm">
              <span className="text-3xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-indigo-900">Configuraciones</h1>
              <p className="mt-1 text-indigo-600 text-sm">
                Gestiona tu perfil, preferencias y configuraciones de la aplicación
              </p>
            </div>
          </div>
        </div>

        {/* 🧭 Navegación de pestañas */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-200">
          <div className="border-b border-indigo-200 bg-indigo-50">
            <nav className="flex space-x-6 px-6" aria-label="Tabs">
              {configTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    group relative flex items-center space-x-3 py-4 px-2 border-b-2 font-medium text-sm
                    transition-all duration-200 ease-in-out
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-700 bg-white rounded-t-lg -mb-px'
                      : 'border-transparent text-indigo-500 hover:text-indigo-700 hover:border-indigo-300'
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
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-indigo-500 font-normal mt-0.5 hidden sm:block">
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* 🧩 Contenido de la pestaña activa */}
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        </div>

        {/* 💡 Pie de página */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-indigo-600 bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-200">
            <span>💡</span>
            <span><strong>Tip:</strong> Los cambios se guardan automáticamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
