// src/components/Toast.tsx
import { useToastStore } from "../store/toastStore";

export function Toast() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white
            ${
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
