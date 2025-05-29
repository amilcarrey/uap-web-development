import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState<{ mensaje: string; tipo: "exito" | "error" } | null>(null);

  const mostrarToast = (mensaje: string, tipo: "exito" | "error") => {
    setToast({ mensaje, tipo });
  };

  const cerrarToast = () => setToast(null);

  return { toast, mostrarToast, cerrarToast };
}
