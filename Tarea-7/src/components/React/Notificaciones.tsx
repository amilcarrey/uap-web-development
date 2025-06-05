import React from 'react'
import { useUIStore } from '../../store/UIStore'

export default function Notificaciones() {
  const toasts = useUIStore((state) => state.toasts)
  const dismiss = useUIStore((state) => state.dismissToast)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        dismiss(toasts[0])
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [toasts, dismiss])

  if (toasts.length === 0) return null

  return (
    <div className="toasts">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.mensaje}
          <button onClick={() => dismiss(t)}>x</button>
        </div>
      ))}
    </div>
  )
}
