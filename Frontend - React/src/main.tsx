import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App'; 
import { ToastProvider } from './components/Toast';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Proveedor de react-query para manejo de queries y caché */}
    <QueryClientProvider client={queryClient}>
      {/* Proveedor de toasts para notificaciones globales */}
      <ToastProvider>
        {/* Router para manejo de rutas */}
        <BrowserRouter>
          {/* Proveedor de autenticación */}
          <AuthProvider>
            {/* Proveedor para configuración de usuario */}
            <SettingsProvider>
              <App />
            </SettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>
);
