import type { FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import { showToast } from "../utils/showToast";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, token } = useAuth();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email")!.toString(),
      password: formData.get("password")!.toString(),
    };
    login(data, {
      onSuccess: () => {
        showToast("Logged in successfully!", "success");
        navigate({ to: "/" });
      },
      onError: (error) => {
        showToast((error as Error).message, "error");
      },
    });
  }

  if (token) {
    return <div>Logged in</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-3">
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border border-gray-300 rounded-md p-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border border-gray-300 rounded-md p-2"
      />
      <button type="submit" className="bg-blue-500 text-white rounded-md p-2 cursor-pointer">
        Login
      </button>
    </form>
  );
}