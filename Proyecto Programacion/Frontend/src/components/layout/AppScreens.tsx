import { Toaster } from 'react-hot-toast';
import { Header } from './Header';
import { AuthPage } from '../auth/AuthPage';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout base para todas las pantallas
 * Evita duplicación de código en App.tsx
 */
export function AppLayout({ children }: LayoutProps) {
  return (
    <>
      <Toaster position="top-right" />
      <Header />
      <main style={{
        maxWidth: 600,
        margin: '20px auto',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {children}
      </main>
    </>
  );
}

/**
 * Pantalla de carga durante verificación de autenticación
 */
export function LoadingScreen() {
  return (
    <AppLayout>
      <div className="text-center text-gray-600 py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        Verificando autenticación...
      </div>
    </AppLayout>
  );
}

/**
 * Pantalla de autenticación (login/register)
 */
export function AuthScreen() {
  return (
    <AppLayout>
      <AuthPage />
    </AppLayout>
  );
}
