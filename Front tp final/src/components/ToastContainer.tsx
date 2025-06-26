// src/components/ToastContainer.tsx
import { useToastStore } from "../store/toastStore";

export default function ToastContainer() {
  const { toasts, message, type, visible } = useToastStore();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      {/* Toast único (showToast) */}
      {visible && (
        <div
          className={`px-4 py-2 rounded shadow text-white ${
            type === "success"
              ? "bg-green-500"
              : type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {message}
        </div>
      )}
      
      {/* Múltiples toasts (addToast) */}
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
