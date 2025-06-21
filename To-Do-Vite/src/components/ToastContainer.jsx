import { useEffect } from 'react';
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes, FaTimesCircle } from 'react-icons/fa';
import useAppStore from '../stores/appStore';

const ToastItem = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheck size={16} />;
      case 'error':
        return <FaTimesCircle size={16} />;
      case 'warning':
        return <FaExclamationTriangle size={16} />;
      default:
        return <FaInfo size={16} />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 border-blue-500/30';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      case 'warning':
        return 'text-yellow-300';
      default:
        return 'text-blue-300';
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border ${getBgColor()} backdrop-blur-sm shadow-lg animate-slide-in`}
    >
      <div className={`flex-shrink-0 ${getTextColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 text-white">
        {toast.message}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
        title="Cerrar"
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useAppStore();

  // Auto-remove toasts when they expire
  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
        }, toast.duration);
        
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 