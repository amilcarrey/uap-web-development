import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RegisterData {
  email: string;
  password: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
  };
}

const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
  const res = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error en registro");
  }

  return res.json();
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};
