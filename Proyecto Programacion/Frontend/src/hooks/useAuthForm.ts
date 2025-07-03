import { useState } from "react";


/**
 * Hook personalizado para manejar formularios de autenticación
 * Permite manejar los campos del formulario, cambios, errores y resetear el estado
 * @param initial - Objeto con los campos iniciales del formulario
 * @returns Objeto con los campos, manejador de cambios, error y funciones para reset
 */
export function useAuthForm<T extends Record<string, string>>(initial: T) {
  const [fields, setFields] = useState(initial);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const reset = () => {
    setFields(initial);
    setError("");
  };

  return { fields, setFields, handleChange, error, setError, reset };
}