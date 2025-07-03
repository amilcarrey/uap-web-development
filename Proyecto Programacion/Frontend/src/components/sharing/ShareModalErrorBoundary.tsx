import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ShareModalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ Error en ShareBoardModal:', error);
    console.error('❌ Error info:', errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error en el Modal</h2>
            <p className="text-gray-700 mb-4">
              Ocurrió un error al cargar el modal de compartir.
            </p>
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-gray-600">Ver detalles del error</summary>
              <pre className="text-xs text-red-600 mt-2 p-2 bg-gray-100 rounded overflow-auto">
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
            >
              Reintentar
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
