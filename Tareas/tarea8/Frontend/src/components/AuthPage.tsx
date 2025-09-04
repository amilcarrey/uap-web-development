import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

// Pantalla con tabs para cambiar entre login y registro
export function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="max-w-sm mx-auto mt-10 p-8 bg-white rounded shadow text-center">
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l ${tab === "login" ? "bg-[#a57a5a] text-white" : "bg-gray-200"}`}
          onClick={() => setTab("login")}
        >
          Entrar
        </button>
        <button
          className={`px-4 py-2 rounded-r ${tab === "register" ? "bg-[#a57a5a] text-white" : "bg-gray-200"}`}
          onClick={() => setTab("register")}
        >
          Crear cuenta
        </button>
      </div>
      {tab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
