import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { BoardList } from './components/BoardList';
import { TaskBoard } from './components/TaskBoard';
import { Layout } from './components/Layout';
import { Settings } from './components/Settings';


// Crear ruta raíz con layout
const rootRoute = createRootRoute({
    component: Layout,
});

// Ruta principal que muestra la lista de tableros
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: BoardList,
});

// Ruta para cada tablero individual
const boardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/board/$boardId/$name',
    component: TaskBoard
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: Settings,
});

// Configurar árbol de rutas
export const routeTree = rootRoute.addChildren([indexRoute, boardRoute, settingsRoute]);

// Crear router
export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    // Configuración adicional de enrutamiento
    defaultPendingComponent: () => (
        <div className="p-2 text-center">Cargando...</div>
    ),
    defaultErrorComponent: ({ error }) => (
        <div className="p-2 text-center text-red-500">
            {error.message || 'Error desconocido'}
        </div>
    ),
});

// Declarar tipos para TypeScript
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}