import React, { createContext, useContext, useState } from 'react';

// Tipo para cada toast
export type Toast = {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
};

// Tipo del contexto para exponer toasts y función para agregar uno nuevo
type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
};

// Crear contexto con valor inicial indefinido para detectar uso fuera del proveedor
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Proveedor del contexto de toasts
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para almacenar la lista de toasts activos
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Función para agregar un nuevo toast
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const newToast: Toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);

    // Remover toast después de 3 segundos automáticamente
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}

      {/* Contenedor fijo para mostrar los toasts */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 space-y-4 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`max-w-md w-full px-6 py-4 rounded-lg shadow-lg text-white text-lg font-semibold
              ${
                toast.type === 'success'
                  ? 'bg-blue-400'
                  : toast.type === 'error'
                  ? 'bg-red-400'
                  : 'bg-orange-400' 
              }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de toasts fácilmente
export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToasts debe usarse dentro de <ToastProvider>');
  return context;
};
