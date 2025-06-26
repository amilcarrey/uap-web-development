import { API_URL } from "../../components/TaskManager";
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error logging in');
      }

      return response.json();
    },

    onSuccess: (data) => {
      console.log("Login successful:", data);
    },

    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
}
