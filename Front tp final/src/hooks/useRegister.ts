// src/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ name, password }: { name: string; password: string }) => {
      const res = await fetch("http://localhost:3000/api/auth/", {
        method: "POST",
        body: JSON.stringify({ name, password }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al registrarse");
      }
      return res.json(); // opcional: token o mensaje
    },
  });
}
