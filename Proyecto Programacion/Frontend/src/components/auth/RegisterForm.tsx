import { useAuthForm } from "../../hooks/useAuthForm";
import { useRegister } from "../../hooks/useRegister";

export function RegisterForm() {
  const { fields, handleChange, error, setError } = useAuthForm({
    firstName: "",
    lastName: "",
    alias: "",
    password: "",
  });
  const { register, loading, error: apiError, setError: setApiError } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setApiError(null);
    if (!fields.firstName || !fields.lastName || !fields.alias || !fields.password) {
      setError("Completa todos los campos");
      return;
    }
    const ok = await register(fields.firstName, fields.lastName, fields.alias, fields.password);
    if (!ok) {
      // El error ya lo maneja el hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="firstName"
        type="text"
        placeholder="Nombre"
        className="w-full px-3 py-2 border rounded"
        value={fields.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        type="text"
        placeholder="Apellido"
        className="w-full px-3 py-2 border rounded"
        value={fields.lastName}
        onChange={handleChange}
      />
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
        {loading ? "Cargando..." : "Registrarse"}
      </button>
    </form>
  );
}