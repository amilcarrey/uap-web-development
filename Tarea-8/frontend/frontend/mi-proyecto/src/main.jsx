// frontend/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext.jsx'; // ¡NUEVA IMPORTACIÓN!

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Estas son opciones globales. Puedes quitarlas o ajustarlas.
      // Por ahora, es un buen punto de partida con los defaults de Tanstack Query.
      // staleTime: Infinity, // Los datos se consideran "stale" inmediatamente
      // refetchOnWindowFocus: false, // Desactiva el refetch al volver a la ventana
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* ¡NUEVO! Envuelve App con AuthProvider para que el contexto de autenticación esté disponible */}
      <AuthProvider>
        <App />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);