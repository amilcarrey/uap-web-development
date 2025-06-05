import React from 'react';
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,          // 👈 se importa Outlet directamente
} from '@tanstack/react-router';

import TaskApp      from './components/TaskApp';     // tu pantalla principal
import SettingsPage from './pages/SettingsPage.tsx';
import NotFound     from './pages/NotFound';         

/* ───── Root (layout) ─────────────────────────────────────────── */
const RootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex gap-4">
        <a href="/">Inicio</a>
        <a href="/settings">Settings</a>
      </header>

      <main className="p-6">
        <Outlet />       {/* ← aquí se renderizan los hijos */}
      </main>
    </div>
  ),
});

/* ───── Rutas hijas ───────────────────────────────────────────── */
const IndexRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: TaskApp,
});

const SettingsRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/settings',
  component: SettingsPage,
});

const CatchAllRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '*',
  component: NotFound,
});

/* ───── Router ───────────────────────────────────────────────── */
const routeTree = RootRoute.addChildren([
  IndexRoute,
  SettingsRoute,
  CatchAllRoute,
]);

export const router = createRouter({ routeTree });

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
