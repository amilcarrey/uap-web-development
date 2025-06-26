import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../../components/TaskManager';

// Tipos para input y respuesta
type RegisterInput = {
  email: string;
  password: string;
};

type RegisterResponse = {
  message: string;
  user: {
    id: number;
    email: string;
  };
};

export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: async ({ email, password }) => {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en registro.');
      }

      return response.json();
    },

    onSuccess: () => {
      console.log("Usuario registrado exitosamente.");
    },

    onError: () => {
      console.log("Ha ocurrido un error.");
    }
  });
}
