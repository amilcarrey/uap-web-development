// src/components/Notificaciones.tsx
import { useNotificacionesStore } from "../components/store/useNotificacionesStore";

const Notificaciones = () => {
  const { notificaciones } = useNotificacionesStore();

  return (
    <div className="fixed top-[90px] right-4 z-50 space-y-2 w-[300px]">
      {notificaciones.map(({ id, mensaje, tipo }) => (
        <div
          key={id}
          className={`relative p-4 rounded-lg shadow-md text-sm text-white animate-fade-in-down
            ${
              tipo === "success"
                ? "bg-green-500"
                : tipo === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
        >
          {mensaje}
          <div className="absolute bottom-0 left-0 h-1 bg-white/50 animate-progress w-full" />
        </div>
      ))}

      <style>
        {`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-progress {
          animation: progress 2s linear forwards;
        }
      `}
      </style>
    </div>
  );
};

export default Notificaciones;
