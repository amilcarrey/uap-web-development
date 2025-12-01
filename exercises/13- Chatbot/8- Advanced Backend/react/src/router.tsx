import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BoardsPage } from './components/BoardsPage';
import { Index } from './pages';
import { Settings } from './pages/settings';
import { NotFoundPage } from './pages/not-found';
import { App } from './App';


export const router = createBrowserRouter([
  // 🔓 Rutas públicas (sin autenticación)
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/register', 
    element: <RegisterForm />,
  },

  // Redireccion inicial
  {
    path: '/',
    element: <Navigate to="/boards" replace />,
  },

  // 🔒 Rutas protegidas (requieren autenticación)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'boards',
        element: <BoardsPage />,
      },
      {
        path: 'boards/:boardId',
        element: <Index />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },

  // 🚫 404 global (SIN autenticación requerida)
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
