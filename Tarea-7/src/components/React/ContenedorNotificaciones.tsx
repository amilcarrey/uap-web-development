import React from "react"
import { useToastStore } from "../../store/NotificacionesStore"

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  React.useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    )
    return () => timers.forEach(clearTimeout)
  }, [toasts, removeToast])

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 9999 }}>
      {toasts.map(({ id, message, type }) => (
        <div
          key={id}
          style={{
            marginBottom: 8,
            padding: 10,
            borderRadius: 4,
            color: "white",
            backgroundColor:
              type === "success"
                ? "green"
                : type === "error"
                ? "red"
                : "gray",
          }}
        >
          {message}
        </div>
      ))}
    </div>
  )
}
