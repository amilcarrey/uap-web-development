import { useNotificationStore } from '../stores/notificationStore'

export default function ToastContainer() {
  const notifications = useNotificationStore((s) => s.notifications)
  const removeNotification = useNotificationStore((s) => s.removeNotification)

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            padding: '12px 20px',
            borderRadius: 6,
            background: n.type === 'error' ? '#f87171'
              : n.type === 'success' ? '#4ade80'
              : '#60a5fa',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
          onClick={() => removeNotification(n.id)}
        >
          {n.message}
        </div>
      ))}
    </div>
  )
}