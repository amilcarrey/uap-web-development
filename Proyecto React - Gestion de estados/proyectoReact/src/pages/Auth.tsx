import React, { useState, useEffect, use } from "react";
import { RegisterForm } from "../components/RegisterForm";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";

export function AuthPage() {
  // Estado para saber qué formulario mostrar: "login", "register" o ninguno
  // const [activeForm, setActiveForm] = useState<"login" | "register" | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(true);

  useEffect(() => {
    if (token) {
      navigate({ to: "/" });
    }
  }, [token, navigate]);

  if (token) return null;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex gap-4 mb-4 justify-center">
        <button
          className={`px-4 py-2 rounded ${
            showRegister ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowRegister(true)}
        >
          Register
        </button>

        <button
          className={`px-4 py-2 rounded ${
            !showRegister ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setShowRegister(false)}
        >
          Login
        </button>
      </div>

      <div>
        {showRegister ? <RegisterForm /> : <LoginForm />}
      </div>
    </div>
  );
}
