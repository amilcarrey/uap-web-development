import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Boards from './pages/Boards';
import BoardDetail from './pages/BoardDetail';
import SharedBoard from './pages/SharedBoard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorPage from './components/ErrorPage';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

const AppLayout = () => <Outlet />;

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: '/home',
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      {
        path: '/boards',
        element: <ProtectedRoute><Boards /></ProtectedRoute>,
      },
      {
        path: '/board/:boardName',
        element: <ProtectedRoute><BoardDetail /></ProtectedRoute>,
      },
      {
        path: '/shared/:token',
        element: <SharedBoard />,
      },
      {
        path: '/settings',
        element: <ProtectedRoute><Settings /></ProtectedRoute>,
      },
      {
        path: '/admin',
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
      }
    ]
  }
]);

export default router;