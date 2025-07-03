import { useState } from "react";
import type { AuthFormData } from "../types/auth";

// Props para el formulario de autenticación
interface AuthFormProps {
  onSubmit: (data: AuthFormData) => void; // función a ejecutar al enviar el formulario
  title: string; // título del formulario
  submitText: string; // texto del botón de envío
  includeUsername?: boolean; // si se debe incluir el campo de nombre de usuario
}

// Componente de formulario de autenticación reutilizable
export default function AuthForm({
  onSubmit,
  title,
  submitText,
  includeUsername = false,
}: AuthFormProps) {
  // Estado local para los datos del formulario
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
  });

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      {/* Campo para el nombre de usuario, solo si includeUsername es true */}
      {includeUsername && (
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
      )}

      {/* Campo para el correo electrónico */}
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />
      {/* Campo para la contraseña */}
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />
      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {submitText}
      </button>
    </form>
  );
}
