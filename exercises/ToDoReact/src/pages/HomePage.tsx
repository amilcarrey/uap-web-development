import { Link } from "@tanstack/react-router";
import { useTabs } from "../hooks/useTabs";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner";

function HomePage() {
  const { user } = useAuthStore();
  const { data: tabsData, isLoading, error } = useTabs();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">No se pudieron cargar las pestañas</p>
        </div>
      </div>
    );
  }

  const tabs = tabsData?.tabs || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ¡Bienvenido/a, {user?.username}!
          </h1>
          <p className="text-lg text-gray-600">
            Organiza tus tareas y proyectos de manera eficiente
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {tabs.length}
            </div>
            <div className="text-gray-600 mt-2">Pestañas Totales</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {
                tabs.filter((tab: string) => tab.toLowerCase() === "today")
                  .length
              }
            </div>
            <div className="text-gray-600 mt-2">Tareas de Hoy</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {
                tabs.filter((tab: string) => tab.toLowerCase() !== "today")
                  .length
              }
            </div>
            <div className="text-gray-600 mt-2">Proyectos</div>
          </div>
        </div>

        {/* Quick Access to Tabs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Acceso Rápido a tus Pestañas
          </h2>
          {tabs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tabs.map((tab: string, index: number) => (
                <Link
                  key={index}
                  to="/tab/$tabId"
                  params={{ tabId: tab }}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {tab}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {tab.toLowerCase() === "today"
                          ? "Tareas del día"
                          : "Proyecto"}
                      </p>
                    </div>
                    <div className="text-gray-400 group-hover:text-blue-500">
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Aún no tienes pestañas creadas
              </p>
              <Link
                to="/tab/$tabId"
                params={{ tabId: "today" }}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear tu primera pestaña
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/tab/$tabId"
              params={{ tabId: "today" }}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="text-blue-600 mr-3 text-xl">📅</div>
              <div>
                <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                  Ver Tareas de Hoy
                </h3>
                <p className="text-sm text-gray-500">
                  Revisa y gestiona tus tareas diarias
                </p>
              </div>
            </Link>
            <Link
              to="/settings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="text-gray-600 mr-3 text-xl">⚙️</div>
              <div>
                <h3 className="font-medium text-gray-800 group-hover:text-gray-600">
                  Configuración
                </h3>
                <p className="text-sm text-gray-500">
                  Personaliza tu experiencia
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
