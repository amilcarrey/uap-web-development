import { useEffect } from 'react';
import useUIStore from '../stores/uiStore';

export default function Toast() {
  const { notification, clearNotification } = useUIStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div className={`px-6 py-3 rounded-xl shadow-lg text-white font-semibold text-center transition-all
        ${notification.type === 'error' ? 'bg-red-500' : notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
      >
        {notification.message}
        <button className="ml-4 text-white/80 hover:text-white text-lg" onClick={clearNotification}>&times;</button>
      </div>
    </div>
  );
} 