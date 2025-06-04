import React, { createContext, useContext, useState } from 'react';

export type Toast = {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const newToast: Toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

return (
  <ToastContext.Provider value={{ toasts, addToast }}>
    {children}
    {/* Contenedor de toasts*/}
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
}

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToasts debe usarse dentro de <ToastProvider>');
  return context;
};
