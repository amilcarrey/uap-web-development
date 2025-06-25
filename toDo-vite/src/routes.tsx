import { createRootRoute, createRoute, Router , Outlet, createRouter} from "@tanstack/react-router";
import App from "./App.tsx";
import Home from "./pages/Home.tsx";
import BoardPage from "./pages/BoardPage";
import SettingsPage from "./pages/SettingsPage.tsx";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    // Redirigir a login si no está autenticado
    window.location.href = '/login';
    return null;
  }
  
  return <>{children}</>;
}

// Componente para envolver tu aplicación con el AuthProvider
const RootComponent = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

// Actualizar la ruta raíz para usar el nuevo componente
const rootRoute = createRootRoute({component: RootComponent});

// Rutas protegidas (requieren autenticación)
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component:  () => (
    <ProtectedRoute> 
      <Home />
    </ProtectedRoute>
      ),
});

const boardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/board/$boardId",
  component: () => (
    <ProtectedRoute>
      <BoardPage />
    </ProtectedRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
});

// Rutas públicas (no requieren autenticación)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});



const routeTree = rootRoute.addChildren([
  homeRoute,
  boardRoute,
  settingsRoute,
  loginRoute,
  registerRoute


]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
export { boardRoute };