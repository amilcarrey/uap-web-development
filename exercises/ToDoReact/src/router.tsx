import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import App from "./App";
import TabPage from "./pages/TabPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

//PATH INICIO/HOME
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <App redirectTo="/tab/today" />,
});

//PATH DEL ID DE LA PESTANIA QUE CORRESPONDE
const tabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tab/$tabId",
  component: TabPage,
});

//SETTINGS PAGE
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
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
