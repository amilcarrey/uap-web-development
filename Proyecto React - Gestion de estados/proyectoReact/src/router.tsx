import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import { App } from "./App";
import { Index } from "./pages";
import { TasksDetails } from "./pages/TasksDetails";
import { Configuration } from "./pages/Configuration";

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Index,
  path: "/",
});

const boardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/boards/$boardId",
  component: Index,
});

const tasksDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks/$taskId",
  component: TasksDetails,
});

const configurationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/configuration",
  component: Configuration,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  boardsRoute,
  tasksDetailsRoute,
  configurationRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}