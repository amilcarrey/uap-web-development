import { useState } from "react";

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