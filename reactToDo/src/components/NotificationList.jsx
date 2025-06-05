import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useClientStore } from '../stores/clientStore';

export default function NotificationList() {
  const { notifications, removeNotification } = useClientStore();

  useEffect(() => {
    if (notifications.length === 0) return;
    // Elimina cada notificación después de 2 segundos
    const timers = notifications.map(n =>
      setTimeout(() => removeNotification(n.id), 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`px-4 py-2 rounded shadow-lg text-white ${
              n.type === 'success'
                ? 'bg-green-500'
                : n.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
          >
            <div className="flex items-center justify-between space-x-4">
              <span>{n.message}</span>
              <button
                onClick={() => removeNotification(n.id)}
                className="ml-2 text-white font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}