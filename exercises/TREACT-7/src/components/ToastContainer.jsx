// src/components/ToastContainer.jsx
import React, { useEffect } from 'react';
import { useToastStore } from '../stores/toastStore';

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    // Por cada toast que aparezca, lo removemos automáticamente tras 3s
    toasts.forEach((toast) => {
      if (!toast.timeoutId) {
        const timeoutId = setTimeout(() => {
          removeToast(toast.id);
        }, 3000);
        // Actualizamos el toast para que no lo vuelva a recrear
        toast.timeoutId = timeoutId;
      }
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          className={`
            max-w-xs px-4 py-2 rounded shadow-lg text-white
            ${type === 'success' ? 'bg-green-500' : ''}
            ${type === 'error' ? 'bg-red-500' : ''}
            ${type === 'info' ? 'bg-blue-500' : ''}
          `}
        >
          {message}
        </div>
      ))}
    </div>
  );
}
