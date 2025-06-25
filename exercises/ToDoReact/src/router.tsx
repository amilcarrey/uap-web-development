import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import App from "./App";
import TabPage from "./pages/TabPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

//PATH INICIO/HOME
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <App redirectTo="/tab/today" />
    </ProtectedRoute>
  ),
});

//AUTH ROUTES
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

//PATH DEL ID DE LA PESTANIA QUE CORRESPONDE
const tabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tab/$tabId",
  validateSearch: (search: Record<string, unknown>) => {
    return {
      search: (search.search as string) || undefined,
    };
  },
  component: () => (
    <ProtectedRoute>
      <TabPage />
    </ProtectedRoute>
  ),
});

//SETTINGS PAGE
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
});

//ERROR 404 PAGE
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: NotFoundPage,
});

//NEW INSTANCE OF THE ROUTE TREE
const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  tabRoute,
  settingsRoute,
  notFoundRoute,
]);

//NEW ROUT 11 hehe
export const router = createRouter({ routeTree });

// Register the router with the @tanstack/react-router, for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

//PREGUNTAR AL PROFE SI ES CORRECTO LA MANERA EN CREAR ESTAS ROUTES CON LOS PATH Y COMPONENTES CORRESPONDIENTES.
// AIUDA
