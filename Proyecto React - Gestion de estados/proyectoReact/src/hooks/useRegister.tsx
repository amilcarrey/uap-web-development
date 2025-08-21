import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks"; // Asegurate que este path sea correcto
import { showToast } from "../utils/showToast";

type RegisterInput = {
  email: string;
  password: string;
};

export function useRegister() {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ email, password }: RegisterInput) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to register");
      }

      return response.json();
    },
    onSuccess: () => {
      showToast("Registration successful!", "success");
    },
    onError: (error) => {
      showToast(`Registration failed: ${error.message}`, "error");
    },
  });
}
