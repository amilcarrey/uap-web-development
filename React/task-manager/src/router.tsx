import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import ToDoApp from "./ToDoApp";
import Configuraciones from "./components/Configuraciones";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/boards/$boardId",
  component: ({ params }) => <ToDoApp boardId={params.boardId} />,
});

const configuracionesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/configuraciones",
  component: Configuraciones,
});

const routeTree = rootRoute.addChildren([
  boardRoute,
  configuracionesRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { boardRoute };