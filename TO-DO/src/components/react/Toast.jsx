import React, { useEffect } from 'react';

const Toast = ({ 
  message, 
  type = 'info', // 'success', 'error', 'info', 'warning'
  duration = 1000,  // tiempo de duracion del toast
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = "p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out animate-slideIn";
    
    const typeStyles = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      warning: "bg-yellow-500 text-white"
    };

    return `${baseStyles} ${typeStyles[type]}`;
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast; 