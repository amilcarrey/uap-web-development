// src/components/NotificationToast.jsx
import React from 'react';
import useNotificationStore from '../store/notificationStore'; // Importa tu store

const NotificationToast = () => {
  // Accede al estado de la notificación desde el store de Zustand
  const { message, type, isVisible, hideNotification } = useNotificationStore();

  // Mapea los tipos a clases de Tailwind CSS para diferentes estilos
  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  // Si no es visible, no renderizamos nada
  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 p-4 rounded-md text-white shadow-lg z-50 transition-transform duration-300 transform ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      } ${typeClasses[type] || typeClasses.info}`} // Aplica las clases de estilo según el tipo
      role="alert"
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{message}</span>
        <button
          onClick={hideNotification} // Permite ocultar la notificación manualmente
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;