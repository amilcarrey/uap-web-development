
import { 
  createRouter, 
  createRootRoute,
createRoute,
 } from '@tanstack/react-router'
   import {App} from './App'
import Home from './pages/Home'
import {Index} from './pages/Index'
import ConfigPage from './pages/Configuracion'
import ReminderPage from './pages/Reminders'
import AuthPage from './pages/Auth'


const rootRoute = createRootRoute({
  component: App,
});


const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Index,
  path: "/",
 //beforeLoad: requireAuth, // Asegura que el usuario esté autenticado antes de cargar la ruta
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

const reminderRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: ReminderPage,
  path: "/reminder/$boardId",
});



const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: AuthPage,
  path: "/login",
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: AuthPage,
  path: "/register",
});

const routeTree = rootRoute.addChildren([
 homeRoute,
 boardRoute,
 configRoute,
 reminderRoute,
 loginRoute,
 registerRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}