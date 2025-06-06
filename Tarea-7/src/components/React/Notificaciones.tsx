import React, { useEffect } from "react";
import { create } from "zustand";

// Tipos
interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}

// Zustand store
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Componente
export const Notificaciones = () => {
  const { toasts, removeToast } = useToastStore();

  // Auto-remover cada toast después de 3 segundos
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, removeToast]);

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 9999,
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            backgroundColor:
              toast.type === "success"
                ? "#d4edda"
                : toast.type === "error"
                ? "#f8d7da"
                : "#cce5ff",
            color:
              toast.type === "success"
                ? "#155724"
                : toast.type === "error"
                ? "#721c24"
                : "#004085",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
