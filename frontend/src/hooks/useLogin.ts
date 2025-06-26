import { useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
}

const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const res = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error en login");
  }
  return res.json();
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      queryClient.setQueryData(["currentUser"], data.user);
    },
  });
};
