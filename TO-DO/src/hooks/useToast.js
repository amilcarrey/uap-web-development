import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration) => {
    addToast({ message, type: 'success', duration });
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    addToast({ message, type: 'error', duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    addToast({ message, type: 'info', duration });
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    addToast({ message, type: 'warning', duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};

export default useToast; 