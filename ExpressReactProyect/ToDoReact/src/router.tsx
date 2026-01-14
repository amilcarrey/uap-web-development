import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import TaskManager from "./components/taskManager";
import Settings from "./components/settings";

// Ruta raíz
const rootRoute = createRootRoute();

// /categorias/:categoriaId -> TaskManager
const taskManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categorias/$categoriaId",
  component: TaskManager,
  validateSearch: (search) => ({
    filtro:
      search.filtro === "completadas" || search.filtro === "pendientes"
        ? search.filtro
        : undefined,
  }),
});

// /settings -> Settings
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Settings,
});

// Crea el router
const router = createRouter({
  routeTree: rootRoute.addChildren([
    taskManagerRoute,
    settingsRoute,
    homeRoute,
  ]),
  defaultPreload: "intent",
});

export default router;

