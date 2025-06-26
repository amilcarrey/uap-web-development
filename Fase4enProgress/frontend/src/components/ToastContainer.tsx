// src/components/ToastContainer.tsx
import { useToastStore } from "../store/toastStore";

const ToastContainer = () => {
  const { toasts, eliminarToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded shadow text-white flex justify-between items-center gap-4 ${
            toast.tipo === "exito" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span>{toast.mensaje}</span>
          <button onClick={() => eliminarToast(toast.id)} className="text-sm">✖</button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
