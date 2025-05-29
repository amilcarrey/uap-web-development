import { useEffect } from "react";

type ToastProps = {
  mensaje: string;
  tipo: "exito" | "error" | "info"; 
  onCerrar: () => void;
};

export default function Notificacion({ mensaje, tipo, onCerrar }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onCerrar, 3000); 
    return () => clearTimeout(timer);
  }, [onCerrar]);

  const getBackgroundColor = () => {
    switch (tipo) {
      case "exito":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 p-3 rounded shadow-lg text-white ${getBackgroundColor()}`}
    >
      {mensaje}
    </div>
  );
}