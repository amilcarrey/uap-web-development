import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import TaskManager from "./components/taskManager";
import Settings from "./components/settings";
import Login from "./components/logIn";
import ProtectedRoute from "./components/protectedRoutes";

// Ruta raíz
const rootRoute = createRootRoute();

// /login -> Login (SIN PROTECCIÓN)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// /categorias/:categoriaId -> TaskManager (CON PROTECCIÓN)
const taskManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categorias/$categoriaId",
  component: () => (
    <ProtectedRoute>
      <TaskManager />
    </ProtectedRoute>
  ),
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
  component: () => (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  ),
});

// Crea el router
const router = createRouter({
  routeTree: rootRoute.addChildren([
    loginRoute,
    // agregamos las rutas hijas y protegidas
    taskManagerRoute,
    settingsRoute,
    homeRoute,
  ]),
  defaultPreload: "intent",
});

export default router;

