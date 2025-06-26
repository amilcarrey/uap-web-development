// src/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { useToastStore } from "../store/toastStore";

export function useRegister() {
  const { showToast } = useToastStore();
  
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ name, password }: { name: string; password: string }) => {
      const res = await fetch("http://localhost:3000/api/auth/", {
        method: "POST",
        body: JSON.stringify({ name, password }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Error al registrarse:", errorData);
        
        // Manejar diferentes tipos de errores
        if (errorData.error === "Errores de validación" && errorData.details) {
          // Mostrar errores de validación específicos
          const validationErrors = errorData.details.map((detail: any) => detail.message).join(", ");
          //showToast(`Errores de validación: ${validationErrors}`, "error");
          throw new Error(validationErrors);
        } else if (errorData.error) {
          // Mostrar error genérico del servidor
          //showToast(errorData.error, "error");
          throw new Error(errorData.error);
        } else {
          // Error desconocido
          //showToast("Error al registrarse", "error");
          throw new Error("Error al registrarse");
        }
      }
      
      // Si todo sale bien, mostrar éxito
      const result = await res.json();
      showToast("Usuario registrado exitosamente", "success");
      return result;
    },
  });
}
