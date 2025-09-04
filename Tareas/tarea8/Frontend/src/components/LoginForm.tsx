import { useAuthForm } from "../hooks/useAuthForm";
import { useLogin } from "../hooks/useLogin";

// Formulario de ingreso de usuario
export function LoginForm() {
  const { fields, handleChange, error, setError } = useAuthForm({ alias: "", password: "" });
  const { login, loading, error: apiError, setError: setApiError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApiError(null);
    if (!fields.alias || !fields.password) {
      setError("Faltan datos");
      return;
    }
    const ok = await login(fields.alias, fields.password);
    if (!ok) {
      // Error manejado desde el hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="alias"
        type="text"
        placeholder="Alias"
        className="w-full px-3 py-2 border rounded"
        value={fields.alias}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        className="w-full px-3 py-2 border rounded"
        value={fields.password}
        onChange={handleChange}
      />
      {(error || apiError) && <div className="text-red-500 text-sm">{error || apiError}</div>}
      <button type="submit" disabled={loading} className="w-full py-2 bg-[#a57a5a] text-white rounded hover:bg-[#8a6247]">
        {loading ? "Entrando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
