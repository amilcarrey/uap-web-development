import React, { useState } from "react";
import { useRegister } from "../hooks/hooks_users/useRegister";
import { useLogin } from "../hooks/hooks_users/useLogin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UsuarioPage: React.FC = () => {
  // Estado para controlar si estamos en modo registro o login
  const [isRegistering, setIsRegistering] = useState(false);
  // Estados para inputs de formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  // Estado para mostrar errores locales 
  const [localError, setLocalError] = useState("");
  // Estado para mostrar mensajes exitosos
  const [MensajeExitoso, setMensajeExitoso] = useState("");

  // Mutaciones para registro y login
  const RegisterMutation = useRegister();
  const LoginMuattion = useLogin();

  const navigate = useNavigate();
  const { login } = useAuth();

  // Función que maneja el submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan en registro
    if (isRegistering && password !== passwordConfirmed) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    // Limpiar mensajes previos
    setMensajeExitoso("");
    setLocalError("");

    if (isRegistering) {
      // Intentar registrar usuario
      RegisterMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            setMensajeExitoso("Usuario registrado exitosamente.");
          },
          onError: (error) => {
            setLocalError(error.message);
          },
        }
      );
    } else {
      // Intentar iniciar sesión
      LoginMuattion.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            // Guardar token y userId en contexto de autenticación
            login(data.token, data.userId); 
            setMensajeExitoso("Usuario logueado exitosamente.");
            // Redirigir a página principal
            navigate("/");
          },
          onError: (error) => {
            setLocalError(error.message);
          },
        }
      );
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-gray-800/70 dark:bg-gray-800/70 rounded-2xl shadow-2xl p-8 w-full max-w-sm backdrop-blur-sm">
        {/* Título cambia según modo */}
        <h2 className="text-2xl font-bold mb-6 text-center text-white dark:text-white">
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg text-gray-900 dark:text-gray-900 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg text-gray-900 dark:text-gray-900 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Confirmar contraseña solo en modo registro */}
          {isRegistering && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="********"
                value={passwordConfirmed}
                onChange={(e) => setPasswordConfirmed(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          )}

          {/* Mensaje de error (local o desde mutaciones) */}
          {(localError || (isRegistering ? RegisterMutation.isError : LoginMuattion.isError)) && (
            <p className="text-red-500 text-sm text-center">
              {localError ||
                ((isRegistering ? RegisterMutation.error : LoginMuattion.error) as Error)?.message}
            </p>
          )}

          {/* Mensaje de éxito */}
          {MensajeExitoso && (
            <p className="text-green-600 text-center">{MensajeExitoso}</p>
          )}

          {/* Botón submit con estado loading */}
          <button
            type="submit"
            disabled={isRegistering ? RegisterMutation.isPending : LoginMuattion.isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 disabled:opacity-50"
          >
            {isRegistering
              ? RegisterMutation.isPending
                ? "Registrando..."
                : "Registrarse"
              : LoginMuattion.isPending
                ? "Iniciando sesión..."
                : "Iniciar Sesión"}
          </button>
        </form>

        {/* Toggle para cambiar entre login y registro */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMensajeExitoso("");
              setLocalError("");
            }}
            className="text-blue-500 hover:underline text-sm"
          >
            {isRegistering
              ? "¿Ya tienes cuenta? Iniciar sesión"
              : "¿No tienes cuenta? Registrarse"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default UsuarioPage;
