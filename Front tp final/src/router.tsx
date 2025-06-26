// src/router.tsx
import { 
  createRouter, 
  createRootRoute,
createRoute,
redirect,
 } from '@tanstack/react-router'
   import {App} from './App'
import Home from './pages/Home'
import {Index} from './pages/Index'
import ConfigPage from './pages/Configuracion'
import ReminderPage from './pages/Reminders'
import AuthPage from './pages/Auth'
import { queryClient } from './main'
//import LoginModal from './pages/Login'
//import RegisterPage from './pages/Register'
//import { queryClient } from './main' // Importa tu queryClient


// Componente 404 general (opcional)
// function GlobalNotFound() {
//   return (
//     <div style={{ padding: '2rem', textAlign: 'center' }}>
//       <h1>404</h1>
//       <p>La ruta que ingresaste no existe.</p>
//     </div>
//   )
// }

// function requireAuth() {
//   const token = queryClient.getQueryData(['auth-token']);

//   if (!token) {
//     throw redirect({ to: '/login' });
//   }
  
//   return token;
// }
function requireAuth() {
  const authData = queryClient.getQueryData(['auth-status']) as { authenticated?: boolean } | undefined;
  
  if (!authData?.authenticated) {
    throw redirect({ to: '/login' });
  }
  
  return authData;
}

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

// const loginRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   component: LoginModal,
//   path: "/login",
// });

// const registerRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   component: RegisterPage,
//   path: "/register",
// });
// src/router.tsx


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