import { createRootRoute, createRoute, Router , Outlet, createRouter} from "@tanstack/react-router";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import BoardPage from "./pages/BoardPage";
import SettingsPage from "./pages/SettingsPage.tsx";

const rootRoute = createRootRoute({component: App,});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board/$boardId",
  component: BoardPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  boardRoute,
  settingsRoute

]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export { boardRoute };