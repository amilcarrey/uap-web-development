import { createRouter, createRoute, createRootRoute, Outlet, Link } from '@tanstack/react-router'
import Header from './components/Header'
import ListaTareas from './components/ListaTarea'
import FiltroTareas from './components/FiltroTarea'
import AgregarTarea from './components/AgregarTarea'
import Notificacion from './components/Notificacion'
import EliminarCompletadas from './components/EliminarCompletadas'
import { useClientStore } from './store/clientStore'
import { useTablero } from './hooks/useTableros'
import App from './App'

// 1. Crear ruta raíz
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// 2. Crear ruta de inicio
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <App />,
});

// 3. Crear ruta de tablero
const tableroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tablero/$alias',
  component: function TableroPage() {
    const { alias } = tableroRoute.useParams()
    const { toast, cerrarToast } = useClientStore()
    
    const { data: tableroData, isLoading, error } = useTablero(alias)

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-pink-200">
          <p className="text-xl">Cargando tablero...</p>
        </div>
      )
    }

    if (error || !tableroData?.tablero) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-pink-200">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">Tablero no encontrado</p>
            <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">
              Volver al inicio
            </Link>
          </div>
        </div>
      )
    }

    const nombreTablero = tableroData.tablero.nombre

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200 h-screen w-screen">
        <div className="flex flex-col items-center space-y-2">
          <Header tableroNombre={nombreTablero} /> {/* 👈 Solo pasa el nombre */}
          <AgregarTarea tableroAlias={alias} />
          <FiltroTareas />
          <ListaTareas tableroAlias={alias} />
          <EliminarCompletadas tableroAlias={alias} />
        </div>
        {toast && <Notificacion {...toast} onCerrar={cerrarToast} />}
      </div>
    )
  },
})

// 4. Crear árbol de rutas
const routeTree = rootRoute.addChildren([
  indexRoute,
  tableroRoute,
]);

// 5. Crear y exportar router
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});

// 6. Declaración de tipos para TypeScript
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}