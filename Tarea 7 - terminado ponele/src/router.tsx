// src/router.tsx
import { 
  createRouter, 
  createRootRoute,
createRoute, } from '@tanstack/react-router'
   import {App} from './App'
import Home from './pages/Home'
import {Index} from './pages/Index'
import ConfigPage from './pages/Configuracion'


// Componente 404 general (opcional)
function GlobalNotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>La ruta que ingresaste no existe.</p>
    </div>
  )
}

const rootRoute = createRootRoute({
  component: App,
});


const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Index,
  path: "/",
});

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Home,
  path: "/boards/$boardId",
});

const configRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ConfigPage,
  path: "/boards/configuracion",
});

const routeTree = rootRoute.addChildren([
 homeRoute,
 boardRoute,
 configRoute,

]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}