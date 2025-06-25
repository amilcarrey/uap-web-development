import { createRootRoute, createRoute, createRouter, Route } from "@tanstack/react-router";
import RootLayout from "./RootLayout";
import App from "../App";
import Configuracion from "../components/Configuracion";
import Login from "../components/Login";
import Register from "../components/Register"; 
import HomeTableros from "../components/HomeTableros"; // <-- importa tu componente

const rootRoute = createRootRoute({
  component: RootLayout,
});

export const tableroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tablero/$tableroId",
  component: App,
});

export const configRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/configuracion",
  component: Configuracion,
});

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

export const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeTableros,
});

export const routeTree = rootRoute.addChildren([
  homeRoute,        // <-- agrega aquí la ruta raíz
  tableroRoute,
  configRoute,
  loginRoute,
  registerRoute,
]);

export const router = createRouter({ routeTree });
