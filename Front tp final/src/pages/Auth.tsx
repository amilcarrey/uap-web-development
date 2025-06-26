// src/pages/AuthPage.tsx
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { useRegister } from "../hooks/useRegister";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {
    login,
    isPending: loggingIn,
    isError: loginError,
    error: loginErr,
  } = useAuth();

  const {
    mutate: register,
    isPending: registering,
    isError: registerError,
    error: registerErr,
  } = useRegister();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { name, password },
      {
        onSuccess: () => navigate({ to: "/" }),
      }
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register(
      { name, password },
      {
        onSuccess: () => {
          setMode("login");
          setName("");
          setPassword("");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <form
        onSubmit={mode === "login" ? handleLogin : handleRegister}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-pink-600 text-center">
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-lg border border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition"
          disabled={loggingIn || registering}
        >
          {mode === "login"
            ? loggingIn
              ? "Ingresando..."
              : "Iniciar Sesión"
            : registering
            ? "Creando cuenta..."
            : "Registrarse"}
        </button>

        {(mode === "login" && loginError) && (
          <p className="text-sm text-red-500 text-center">
            {(loginErr as Error).message}
          </p>
        )}
        {(mode === "register" && registerError) && (
          <p className="text-sm text-red-500 text-center">
            {(registerErr as Error).message}
          </p>
        )}

        <p className="text-sm text-center text-pink-600">
          {mode === "login" ? (
            <>
              ¿No tenés cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("register")}
                className="underline hover:text-pink-800"
              >
                Registrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="underline hover:text-pink-800"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
