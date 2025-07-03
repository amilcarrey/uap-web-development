import React from 'react';
import { Link } from 'react-router-dom';


/**
 *Componente NotFound que muestra un mensaje de error 404 cuando la página solicitada no se encuentra.
  Para verificar que funcioan correctamente, puedes navegar a una ruta inexistente en tu aplicación.
*/
export function NotFound() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl text-gray-600 mb-6">Página no encontrada</h2>
        <p className="text-gray-500 mb-8">
          Lo siento, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
  Componente ErrorBoundary que captura errores en sus componentes hijos
  y muestra un mensaje de error amigable al usuario.
  
  Eevita que errores de JavaScript rompan toda la aplicación.
  
  ¿CUÁNDO SE ACTIVA?
  - Cuando un componente hijo tiene un error de renderizado
  - Errores como: user.name cuando user es null/undefined
  - Fallos en hooks (useState, useEffect) de componentes hijos
  - NO captura errores en onClick, fetch, setTimeout
  
  EJEMPLOS DE USO:
  
  // 1. Proteger una lista de tareas que puede fallar:
  <ErrorBoundary>
    <TaskList tasks={tasks} />
  </ErrorBoundary>
  
  // 2. Proteger un tablero completo:
  <ErrorBoundary>
    <BoardManager boardId={selectedBoard} />
  </ErrorBoundary>
  
  // 3. Proteger toda una pestaña:
  <ErrorBoundary>
    <TabContent tabId={activeTab} />
  </ErrorBoundary>
 
  CUÁNDO USARLO:
  - Envuelve componentes que manejan datos del servidor
  - Protege listas que pueden estar vacías o malformadas
  - Usa en rutas principales para evitar pantallas blancas
  
  Uso:
  <ErrorBoundary>
    <ComponenteQuePuedeFallar />
  </ErrorBoundary>
  
  La idea es envolver componentes que puedan lanzar errores 
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Oops! Algo salió mal
            </h1>
            <p className="text-gray-600 mb-6">
              Ha ocurrido un error inesperado en la aplicación.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}